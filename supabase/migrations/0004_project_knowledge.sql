-- What Kodexa has actually built, as its own knowledge base.
--
-- Separate from kb_chunks on purpose. kb_chunks answers "what do you sell and
-- how does working with you go"; this answers "show me something you have
-- built and tell me how it works". Two tables rather than a `kind` column
-- because the chatbot searches them independently and merges the results, so
-- a question about a project cannot be crowded out of the top matches by four
-- service descriptions that happen to embed nearby.

create table if not exists public.project_chunks (
  id         bigint generated always as identity primary key,
  project    text not null,   -- the project's slug, for grouping
  title      text not null,   -- what a visitor would call it
  topic      text not null,   -- overview | how-it-works | tech | story
  content    text not null,
  embedding  vector(768),
  updated_at timestamptz not null default now()
);

create index if not exists project_chunks_project_idx on public.project_chunks (project);

create index if not exists project_chunks_embedding_idx
  on public.project_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 10);

create index if not exists project_chunks_fts_idx
  on public.project_chunks using gin (to_tsvector('english', title || ' ' || content));

alter table public.project_chunks enable row level security;

-- Same shape as kb_chunks: no policies on the table, so the only way in is the
-- function below, which hands back the best few matches for one question and
-- nothing else. Writing needs the service role, which only the seed script has.

create or replace function public.match_project_chunks(
  query_embedding vector(768),
  query_text      text default '',
  match_count     int default 3
)
returns table (project text, title text, topic text, content text, similarity float)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.project,
    c.title,
    c.topic,
    c.content,
    (1 - (c.embedding <=> query_embedding))
      + coalesce(
          ts_rank(to_tsvector('english', c.title || ' ' || c.content),
                  plainto_tsquery('english', nullif(query_text, ''))) * 0.5,
          0
        ) as similarity
  from public.project_chunks c
  where c.embedding is not null
  order by similarity desc
  limit least(greatest(match_count, 1), 6);
$$;

revoke execute on function public.match_project_chunks(vector, text, int) from public;
grant execute on function public.match_project_chunks(vector, text, int) to anon, authenticated;
