export default function getImageFullUrl(path) {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/${path}`);
    if (!path) return "";
    return `${process.env.EXPO_PUBLIC_API_URL}/${path}`;
}