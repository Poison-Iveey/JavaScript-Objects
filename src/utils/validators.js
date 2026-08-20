export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
export const EBOOK_EXTENSIONS = [".pdf", ".epub"];
export const EBOOK_MIME_TYPES = ["application/pdf", "application/epub+zip"];

export function isImageFile(file) {
  return Boolean(file && IMAGE_MIME_TYPES.includes(file.type));
}

export function isEbookFile(file) {
  if (!file) return false;
  const name = file.name?.toLowerCase() ?? "";
  const hasEbookExtension = EBOOK_EXTENSIONS.some((ext) => name.endsWith(ext));
  return hasEbookExtension || EBOOK_MIME_TYPES.includes(file.type);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? "");
}
