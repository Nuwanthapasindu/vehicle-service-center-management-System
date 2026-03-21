export default function getImageUrl(path = "") {
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80";

  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http") || path.startsWith("https")) return path;

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  // Normalize backslashes from Windows paths to forward slashes for URLs
  return `${serverUrl}/${path}`;
}
