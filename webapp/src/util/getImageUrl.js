export default function getImageUrl(path = "") {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("https")) return path;

  const serverUrl = import.meta.env.VITE_SERVER_URL.split("/api")[0];
  return `${serverUrl}/uploads/${path}`;
}
