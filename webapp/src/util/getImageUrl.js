export default function getImageUrl(path = "") {
  if (!path) {
    // Default fallback vehicle image
    return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";
  }
  
  if (path.startsWith("http") || path.startsWith("https")) return path;

  return `${import.meta.env.VITE_SERVER_URL}/storage/uploads/${path}`;
}
