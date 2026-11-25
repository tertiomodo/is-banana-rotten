import getApiUrl from "./getApiUrl.js";

// Used for warming up the server
export default async function pingServer() {
  try {
    await fetch(getApiUrl());
  } catch {}
}
