
// Minimal adapter that exposes global loadBooks() and saveBooks(books).
// It will use remote API if window.__USE_REMOTE_API__ === true,
// otherwise it uses localStorage so nothing breaks.

(function () {
  const STORAGE_KEY = 'myLibraryBooks'; // match your project's key if different
  const API_BASE = (window.__API_URL__ || '') + '/api/books';

  async function loadBooksRemote() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to load books from server');
    return res.json();
  }

  async function saveBooksRemote(books) {
    // This adapter will replace the full collection on save by doing individual upserts.
    // For simplicity: delete all and re-add. (Low traffic small app — OK.)
   
    const current = await loadBooksRemote();
    // delete existing
    for (const b of current) {
      await fetch(`${API_BASE}/${b.id}`, { method: 'DELETE' });
    }
    // re-add all
    const added = [];
    for (const b of books) {
      // remove id if exists (server will create new id)
      const payload = (({ id, ...rest }) => rest)(b);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      added.push(await res.json());
    }
    return added;
  }

  function loadBooksLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (_e) {
      return [];
    }
  }

  function saveBooksLocal(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return books;
  }

  // expose global functions used by the existing code
  window.loadBooks = async function () {
    if (window.__USE_REMOTE_API__) {
      try {
        return await loadBooksRemote();
      } catch (err) {
        console.warn('Remote load failed, falling back to localStorage:', err);
        return loadBooksLocal();
      }
    } else {
      return loadBooksLocal();
    }
  };

  window.saveBooks = async function (books) {
    if (window.__USE_REMOTE_API__) {
      try {
        return await saveBooksRemote(books);
      } catch (err) {
        console.warn('Remote save failed, falling back to localStorage:', err);
        return saveBooksLocal(books);
      }
    } else {
      return saveBooksLocal(books);
    }
  };

})();
