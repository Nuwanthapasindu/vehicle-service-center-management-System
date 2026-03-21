export default function getImageUrl(fileName = "") {
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80";

  if (!fileName) return FALLBACK_IMAGE;
  if (fileName.startsWith("http") || fileName.startsWith("https")) return fileName;

  return `${import.meta.env.VITE_SERVER_URL}/storage/uploads/${fileName}`;
}
