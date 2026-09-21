// Static data about requests, safe on the server AND in client components.
//
// It lives apart from data-service.js because that file is server-only (it
// reads cookies through the Supabase client), and the admin's status buttons
// are a client component that needs this list too.

export const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export const STATUS_LABELS = {
  all: "All",
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

// What each status means on screen. Colour is paired with the label
// everywhere it is used, never used alone to carry the meaning.
export const STATUS_STYLE = {
  new: { label: "New", color: "var(--color-primary)" },
  contacted: { label: "Contacted", color: "var(--color-warning)" },
  quoted: { label: "Quoted", color: "var(--color-secondary)" },
  won: { label: "Won", color: "var(--color-success)" },
  lost: { label: "Lost", color: "var(--color-dim)" },
};
