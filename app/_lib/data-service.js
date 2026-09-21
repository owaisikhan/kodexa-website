import "server-only";

// EVERY read query lives in this file.
//
// The public site has no reads yet: the services, process and work sections are
// static data modules (services-data.js), and service_requests is deliberately
// write-only for the anon key, so nothing on the public site can read it back.
//
// When the admin screen is added, its queries go here and nowhere else, so that
// when a figure looks wrong there is exactly one file to search.
