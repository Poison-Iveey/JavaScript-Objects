import { supabase } from "./supabaseClient.js";

const PATCH_KEY_MAP = {
  title: "title",
  author: "author",
  pages: "pages",
  status: "status",
  rating: "rating",
  genre: "genre",
  notes: "notes",
  isFavorite: "is_favorite",
  coverUrl: "cover_url",
};

function toRow(patch) {
  const row = {};
  for (const [key, value] of Object.entries(patch)) {
    const column = PATCH_KEY_MAP[key];
    if (column) row[column] = value;
  }
  return row;
}

function mapBookRow(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    pages: row.pages,
    status: row.status,
    rating: row.rating,
    genre: row.genre,
    notes: row.notes ?? "",
    isFavorite: row.is_favorite,
    coverUrl: row.cover_url,
    fileAttachment: row.file_name ? { name: row.file_name, size: row.file_size, type: row.file_type } : null,
  };
}

function fileExt(file) {
  return file.name.includes(".") ? file.name.split(".").pop() : "bin";
}

async function uploadCover(userId, bookId, file) {
  const path = `${userId}/${bookId}.${fileExt(file)}`;
  const { error } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("covers").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

async function uploadEbook(userId, bookId, file) {
  const path = `${userId}/${bookId}.${fileExt(file)}`;
  const { error } = await supabase.storage.from("ebooks").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return { file_name: file.name, file_size: file.size, file_type: file.type };
}

export async function getBooks(userId) {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data.map(mapBookRow);
}

export async function getBook(userId, bookId) {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .eq("id", bookId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapBookRow(data) : null;
}

export async function addBook(userId, { title, author, pages, status = "want", genre = null, coverImageFile, fileAttachment }) {
  const { data, error } = await supabase
    .from("books")
    .insert({ user_id: userId, title, author, pages: Number(pages) || null, status, genre })
    .select()
    .single();
  if (error) throw new Error(error.message);

  let book = mapBookRow(data);
  if (coverImageFile) book = await updateCoverImage(userId, book.id, coverImageFile);
  if (fileAttachment) book = await attachFile(userId, book.id, fileAttachment);
  return book;
}

export async function updateBook(userId, bookId, patch) {
  const { data, error } = await supabase
    .from("books")
    .update(toRow(patch))
    .eq("user_id", userId)
    .eq("id", bookId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapBookRow(data);
}

export async function setStatus(userId, bookId, status) {
  const patch = status === "read" ? { status } : { status, isFavorite: false };
  return updateBook(userId, bookId, patch);
}

export async function toggleFavorite(userId, bookId) {
  const book = await getBook(userId, bookId);
  if (!book) throw new Error("Book not found.");
  return updateBook(userId, bookId, { isFavorite: !book.isFavorite });
}

export async function removeBook(userId, bookId) {
  const book = await getBook(userId, bookId);

  if (book?.coverUrl) {
    const ext = book.coverUrl.split("?")[0].split(".").pop();
    await supabase
      .storage.from("covers")
      .remove([`${userId}/${bookId}.${ext}`])
      .catch(() => {});
  }
  if (book?.fileAttachment) {
    const ext = fileExt({ name: book.fileAttachment.name });
    await supabase
      .storage.from("ebooks")
      .remove([`${userId}/${bookId}.${ext}`])
      .catch(() => {});
  }

  const { error } = await supabase.from("books").delete().eq("user_id", userId).eq("id", bookId);
  if (error) throw new Error(error.message);
}

export async function updateCoverImage(userId, bookId, file) {
  const coverUrl = await uploadCover(userId, bookId, file);
  return updateBook(userId, bookId, { coverUrl });
}

export async function attachFile(userId, bookId, file) {
  const meta = await uploadEbook(userId, bookId, file);
  const { data, error } = await supabase.from("books").update(meta).eq("user_id", userId).eq("id", bookId).select().single();
  if (error) throw new Error(error.message);
  return mapBookRow(data);
}

export async function removeFileAttachment(userId, bookId) {
  const book = await getBook(userId, bookId);
  if (book?.fileAttachment) {
    const ext = fileExt({ name: book.fileAttachment.name });
    await supabase
      .storage.from("ebooks")
      .remove([`${userId}/${bookId}.${ext}`])
      .catch(() => {});
  }

  const { data, error } = await supabase
    .from("books")
    .update({ file_name: null, file_size: null, file_type: null })
    .eq("user_id", userId)
    .eq("id", bookId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapBookRow(data);
}

// Reads from the public_books VIEW — notes are never selected here (they're
// simply not a column in the view), and rating/favorite/reading-status are
// already nulled server-side per the owner's visibility toggles. The
// `_visibility` param is accepted for call-site compatibility but unused:
// unlike Phase 1's mock, that filtering now happens in SQL, not here.
export async function getPublicBooks(userId, _visibility) {
  const { data, error } = await supabase.from("public_books").select("*").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    pages: row.pages,
    status: row.status,
    rating: row.rating,
    genre: row.genre,
    isFavorite: row.is_favorite,
    coverUrl: row.cover_url,
  }));
}
