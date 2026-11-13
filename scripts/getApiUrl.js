export default function getApiUrl() {
  const origin = document.location.origin;
  const localServer = "http://127.0.0.1:8000";
  const productionServer = "https://is-banana-rotten-server.onrender.com";
  const apiUrl =
    origin === "http://localhost:5500" ? localServer : productionServer;

  return apiUrl;
}
