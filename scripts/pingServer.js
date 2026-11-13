import getApiUrl from "./getApiUrl.js";

export default async function pingServer() {
  await fetch(getApiUrl());
}
