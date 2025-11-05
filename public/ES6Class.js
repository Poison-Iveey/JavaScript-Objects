// public/ES6Class.js
// Clean, fixed version that uses window.loadBooks() / window.saveBooks()
// - loads from adapter on startup
// - persists on add/remove/toggle (remote-first with local fallback)
//
// Keep function names the same so other code still works.

document.addEventListener('DOMContentLoaded', function () {
  window.newBookButton = document.getElementById('newBookButton');
  window.newBookDialog = document.getElementById('newBookDialog');
  window.newBookForm = document.getElementById('newBookForm');
  window.libraryDiv = document.getElementById('book-container');

  // Start the app
  initApp();
});

let allBooks = []; 

class Books {
  // constructor signature kept as before: (tittle, author, pages, isRead)
  constructor(tittle, author, pages, isRead) {
   
    this.tittle = tittle || '';
    this.author = author || '';
    this.pages = pages || '';
 
    this.isRead = (typeof isRead === 'boolean') ? isRead : (String(isRead) === 'true');

    allBooks.push(this);
    }

  // Toggle read status method
  toggleReadStatus() {
    this.isRead = !this.isRead;
  }

  
  displayInfo() {
    const readStatus = this.isRead ? "already read" : "not read yet";
    return `${this.tittle} by ${this.author}, ${this.pages} , ${readStatus}`;
  }
}


async function initApp() {
  try {
    let loaded = [];
    if (typeof window.loadBooks === 'function') {
      loaded = await window.loadBooks();
    } else {
      // fallback to localStorage directly when adapter isn't available
      const raw = localStorage.getItem('myLibraryBooks');
      loaded = raw ? JSON.parse(raw) : [];
    }

    // Clear previous list
    allBooks = [];

    if (Array.isArray(loaded) && loaded.length > 0) {
      // Server objects might use 'title' field; UI uses 'tittle' spelling.
      // Map server object -> Books(...) call. This ensures methods exist.
      loaded.forEach(b => {
        const t = b.tittle || b.title || '';
        const a = b.author || '';
        const p = b.pages || '';
        const r = (typeof b.read === 'boolean') ? b.read : (String(b.read) === 'true');
        new Books(t, a, p, r);
      });
    } else {
      new Books("The Alchemist", "Paulo Coelho", "420 pages", "true");
      new Books("The KIte Runner", "Khaled Hosseini", "500 pages", "false");
      new Books("A Thousand Splendid Suns", "Khaled Hosseini", "570 pages", "true");
      new Books("Stay with Me", "Ayobami Adebayo", "870 pages", "true");
      new Books("Metamorphosis", "Franz Kafka", "350 pages", "true");
      new Books("Trial", "Franz Kafka", "500 pages", "false");
      new Books("The Songs of Achilles", "Madeline Miller", "900 pages", "true");
      new Books("Wanderlust", "Danielle Steel", "705 pages", "true");
      new Books("Days at the Morisaki Bookshop", "Eric Ozawa", "300 pages", "true");
      new Books("Tomorrow I Become a Woman", "Aiwanose Odafen", "613 pages", "true");
      new Books("The Vanishing Half" , "Brit Bennett" ,"450 pages", "true");
      new Books("The Vegetarian","Han Kang","200 pages", "true");
      new Books("The Seven Husbands of Evelyn Hugo" ,"Taylor Jenkins Reid" , "389 pages", "true");
      new Books("Nearly all men in Lagos are mad" ,"Damilare Kuku" , "254 pages", "true");
      new Books("Mine Boy" ,"Peter Abrahams" , "261 pages", "true");
      new Books("Home Going" ,"Yaa Gyasi" , "305 pages", "true");
      new Books("The Little Prince" ,"Antoine De Saint-Exupery" , "96 pages", "true");
      new Books("The Three of us" ,"Ore Agbaje-Williams" , "192 pages", "true");
      new Books("Everything I never told you" ,"Celest Ng" , "297 pages", "false");
      new Books("Under the Udala Trees" ,"Chinelo Okparanta" , "328 pages", "false");
      new Books("I do not come to you by chance" ,"Adaobi Tricia Nwaubani" , "402 pages", "false");
      new Books("No Plan B" ,"Lee Child" , "336 pages", "false");
      new Books("River Secrets" ,"Shannon Hale" , "290 pages", "false");
      new Books("Snow falling on Cedars" ,"David Guterson" , "460 pages", "false");
      new Books("Never Lie" ,"Freida McFdden" , "296 pages", "false");
      new Books("Powerless" ,"Lauren Roberts" , "523 pages", "false");
      new Books("Powerful" ,"Lauren Roberts" , "272 pages", "false");
      new Books("Fearless" ,"Lauren Roberts" , "608 pages", "false");
      new Books("Reckless" ,"Lauren Roberts" , "396 pages", "false");
      new Books("Fourth Wing" ,"Rebecca Yarros" , "517 pages", "false");
 
    }

    // Render the UI
    displayBooks();
  } catch (err) {
    console.error('initApp error:', err);
    // fallback: ensure the UI still displays something
    allBooks = allBooks || [];
    displayBooks();
  }
}

function displayBooks() {
  const container = document.getElementById("book-container");
  if (!container) return;
  container.innerHTML = '';

  allBooks.forEach(function (book, index) {
    const bookCards = document.createElement('div');
    bookCards.classList.add("border", "border-gray-300", "p-5", "rounded-lg", "w-48", "text-center");

    const bookInfo = document.createElement('p');
    bookInfo.textContent = book.displayInfo();
    bookInfo.classList.add('text-sm', 'm-0');

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('bg-teal-600', 'text-white', 'rounded', 'px-3', 'py-1', 'mt-2', 'hover:bg-teal-900', 'focus:outline-none', 'focus:ring-green-300');
    removeButton.setAttribute('data-index', index);
    removeButton.addEventListener('click', async function () {
      await removeBook(index);
    });

    // Read-toggle button
    const readButton = document.createElement('button');
    readButton.className = 'toggle-btn';
    readButton.classList.add('bg-teal-600', 'text-white', 'rounded', 'px-3', 'py-1', 'mt-2', 'hover:bg-teal-900', 'focus:outline-none', 'focus:ring-green-300');
    readButton.setAttribute('data-index', index);
    readButton.textContent = book.isRead ? 'Mark as Unread' : 'Mark as Read';

    readButton.addEventListener('click', async function () {
      // toggle, update display, persist
      book.toggleReadStatus();
      updateBookDisplay(bookCards, book);
      await persistBooks();
    });

    bookCards.appendChild(bookInfo);
    bookCards.appendChild(removeButton);
    bookCards.appendChild(readButton);
    container.appendChild(bookCards);
  });
}

// Remove a book and persist
async function removeBook(index) {
  // remove from array
  if (index >= 0 && index < allBooks.length) {
    allBooks.splice(index, 1);
    displayBooks();
    await persistBooks();
  }
}

function updateBookDisplay(bookDiv, book) {
  const readButton = bookDiv.querySelector('.toggle-btn');
  if (!readButton) return;
  readButton.textContent = book.isRead ? 'Mark as Unread' : 'Mark as Read';
}

// Helper: persist allBooks through adapter (remote-first, adapter does fallback)
async function persistBooks() {
  try {
    if (typeof window.saveBooks === 'function') {
      await window.saveBooks(allBooks);
    } else {
      // fallback to localStorage if adapter not present
      localStorage.setItem('myLibraryBooks', JSON.stringify(allBooks));
    }
  } catch (err) {
    console.error('persistBooks error:', err);
    // on failure, still save to localStorage so user doesn't lose data
    try {
      localStorage.setItem('myLibraryBooks', JSON.stringify(allBooks));
    } catch (e) {
      console.error('localStorage fallback failed:', e);
    }
  }
}

// Show dialog button handler
// newBookButton and newBookDialog were assigned on DOMContentLoaded
if (typeof window.newBookButton !== 'undefined') {
  window.newBookButton.addEventListener('click', function () {
    if (window.newBookDialog && window.newBookDialog.showModal) {
      window.newBookDialog.showModal();
    }
  });
}


if (typeof window.newBookForm !== 'undefined') {
  window.newBookForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const formData = new FormData(window.newBookForm);
      const title = formData.get('title') || '';
      const author = formData.get('author') || '';
      const pages = formData.get('pages') || '';
      const readRaw = formData.get('readStatus') || 'false';
      const isRead = (readRaw === 'true' || readRaw === 'on' || readRaw === 'yes');

      // Create new Books instance (constructor pushes to allBooks)
      new Books(title, author, `${pages} pages`, isRead);

      // Re-render and persist
      displayBooks();
      await persistBooks();

      // Reset & close
      if (typeof window.newBookForm.reset === 'function') window.newBookForm.reset();
      if (window.newBookDialog && window.newBookDialog.close) {
        try { window.newBookDialog.close(); } catch (e) { /* ignore */ }
      }
    } catch (err) {
      console.error('Add book error:', err);
    }
  });
}

  
  
