-- The chatbot's knowledge base.
--
-- Every chunk is derived from this repo (services-data.js and siteConfig.js),
-- never hand-written here, so the assistant cannot quote a service we do not
-- sell or a timeline the page disagrees with. Re-run scripts/seedKnowledge.mjs
-- after editing either file.

create extension if not exists vector;

create table if not exists public.kb_chunks (
  id         bigint generated always as identity primary key,
  topic      text not null,
  title      text not null,
  content    text not null,
  -- 768 dims: enough for a knowledge base this small, and it keeps the index
  -- cheap. Gemini's embedding models can output a smaller-than-native size.
  embedding  vector(768),
  updated_at timestamptz not null default now()
);

create index if not exists kb_chunks_topic_idx on public.kb_chunks (topic);

-- Cosine distance, matching how the embeddings are compared at query time.
create index if not exists kb_chunks_embedding_idx
  on public.kb_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 10);

-- Full text, for the half of retrieval that vectors are bad at: exact terms
-- like "Electron", "APK" or "Core Web Vitals", which a paraphrase-friendly
-- embedding will happily blur into something adjacent.
create index if not exists kb_chunks_fts_idx
  on public.kb_chunks using gin (to_tsvector('english', title || ' ' || content));

alter table public.kb_chunks enable row level security;

-- No policies on the table itself. Retrieval goes through the function below,
-- so the only thing a browser can do is ask for the best few matches for a
-- question: it cannot page through the whole knowledge base, and it cannot
-- write to it.

create or replace function public.match_kb_chunks(
  query_embedding vector(768),
  query_text      text default '',
  match_count     int default 4
)
returns table (topic text, title text, content text, similarity float)
language sql
stable
security definer
set search_path = public
as $$
  -- Vector similarity, with full-text rank as a tie-breaker rather than a
  -- separate ranked list: at this size (a few dozen chunks) fusing two
  -- rankings is more machinery than the problem deserves, but an exact term
  -- match should still be able to pull a chunk up.
  select
    c.topic,
    c.title,
    c.content,
    (1 - (c.embedding <=> query_embedding))
      + coalesce(
          ts_rank(to_tsvector('english', c.title || ' ' || c.content),
                  plainto_tsquery('english', nullif(query_text, ''))) * 0.5,
          0
        ) as similarity
  from public.kb_chunks c
  where c.embedding is not null
  order by similarity desc
  limit least(greatest(match_count, 1), 8);
$$;

revoke execute on function public.match_kb_chunks(vector, text, int) from public;
grant execute on function public.match_kb_chunks(vector, text, int) to anon, authenticated;
