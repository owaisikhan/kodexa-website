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
//
// Each status states its own foreground. The pill used to print `color` as
// text over a 14% wash of itself, which works for a bright screen colour and
// fails completely for a light pigment: ochre text on near-white paper is not
// readable. The chip is solid now and `ink` says what sits on it.
export const STATUS_STYLE = {
  new: { label: "New", color: "var(--color-primary)", ink: "var(--color-ink)" },
  contacted: { label: "Contacted", color: "var(--color-warning)", ink: "var(--color-ink)" },
  quoted: { label: "Quoted", color: "var(--color-secondary)", ink: "var(--color-on-dark)" },
  won: { label: "Won", color: "var(--color-success)", ink: "var(--color-on-dark)" },
  lost: { label: "Lost", color: "var(--color-neutral)", ink: "var(--color-ink)" },
};
