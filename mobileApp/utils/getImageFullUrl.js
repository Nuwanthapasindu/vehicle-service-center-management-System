export default function getImageFullUrl(path) {
    if (!path) return "";
    return `${process.env.EXPO_PUBLIC_API_URL}/${path}`;
}