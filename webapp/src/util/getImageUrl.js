export default function getImageUrl(path = "") {

  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("https")) return path;

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  return `${serverUrl}/${path}`;
}
