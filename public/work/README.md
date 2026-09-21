# Project screenshots

Drop a screenshot in here, then set `shot` on that project in
`app/_lib/services-data.js`:

```js
{
  title: "SAAM'S Store",
  shot: "/work/store.jpg",   // <- this file, path starts at /work
  mock: "store",             // ignored once `shot` is set, kept as a fallback
}
```

That is the whole change. No component edits.

## What to shoot

- **16:10, landscape.** 1600x1000 is ideal; anything wider gets cropped from
  the bottom, since the card shows the top of the image.
- **The screen that explains the product**, not the login page. A dashboard
  with real-looking numbers beats an empty state.
- **Hide anything private** before shooting: real customer names, phone
  numbers, balances. Blur them or use demo data.
- **Full browser width, no browser chrome.** The card supplies its own frame.
- **JPG at about 80% quality**, under ~300KB each. These load on phones over
  mobile data.

## Naming

`store.jpg`, `pump.jpg`, `ledger.jpg`, `hospital.jpg` matching the projects in
`services-data.js`. Phone screenshots work too: they are cropped to 16:10 from
the top, so leave headroom or shoot the phone on a background.
