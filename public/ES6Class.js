document.addEventListener('DOMContentLoaded', function () {
    const newBookButton = document.getElementById('newBookButton');
    const newBookDialog = document.getElementById('newBookDialog');
    const newBookForm = document.getElementById('newBookForm');
    const libraryDiv = document.getElementById('book-container');
  
});


let allBooks = [];  //  this array holds all the book objects

class Books{
    constructor (tittle,author,pages,isRead){    // this () creates  new object with the all the books properties then pushes that object into allBooks() array
    this.tittle = tittle;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead === "true";
    allBooks.push(this);
}
// Add a method to the Book prototype to handle toggling the read status
toggleReadStatus(){
    this.isRead =!this.isRead
}


// Add a method to display the book's information  
displayInfo(){let readStatus;
    if (this.isRead) {
      readStatus = "already read";
  } else {
      readStatus = "not read yet";
  }
  return `${this.tittle} by ${this.author}, ${this.pages} , ${readStatus}`;
};

}


        
function displayBooks() {
    const container = document.getElementById("book-container"); 
     container.innerHTML='';

    allBooks.forEach(function(book,index) {
        const bookCards = document.createElement('div');
        bookCards.classList.add(
            "border", "border-gray-300", "p-5", "rounded-lg", "w-48", "text-center"
        );

        const bookInfo = document.createElement("p");
        bookInfo.textContent = book.displayInfo();  // Get the information from the displayInfo method
        bookInfo.classList.add("text-sm", "m-0");

        // Create the Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add(
          'bg-teal-600',
           'text-white',
           'rounded',
           'px-3',
           'py-1',
           'mt-2',
           'hover:bg-teal-900',
           'focus:outline-none',
           'focus:ring-green-300');
        removeButton.setAttribute('data-index', index); // Store the book's index

        // Add an event listener to remove the book
        removeButton.addEventListener('click', function () {
           removeBook(index);
  });

        const readButton=document.createElement('button');
        if (book.isRead) {
          readButton.textContent = 'Mark as Unread';
        } else {
          readButton.textContent = 'Mark as Read';
        }
        readButton.className = 'toggle-btn';
        readButton.classList.add(
          'bg-teal-600',
           'text-white',
           'rounded',
           'px-3',
           'py-1',
           'mt-2',
           'hover:bg-teal-900',
           'focus:outline-none',
           'focus:ring-green-300'
        );
        readButton.setAttribute('data-index', index);

        readButton.addEventListener('click' , function (){
          book.toggleReadStatus();
          updateBookDisplay(bookCards, book);
        })

        bookCards.appendChild(bookInfo);
        bookCards.appendChild(removeButton);
        container.appendChild(bookCards);
        bookCards.appendChild(readButton);


    
    });  
}

function removeBook(index){
  allBooks.splice(index, 1);

  displayBooks();

}

function updateBookDisplay(bookDiv, book){
  const readButton = bookDiv.querySelector('.toggle-btn');
  if (book.isRead) {
    readButton.textContent = 'Mark as Unread';
} else {
    readButton.textContent = 'Mark as Read';
}


}

newBookButton.addEventListener('click', function () {
    newBookDialog.showModal();
  });

newBookForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents default form submission behavior

  // Collect form values using FormData
  const formData = new FormData(newBookForm);
  const title = formData.get('title');
  const author = formData.get('author');
  const pages = formData.get('pages');
  const readStatus = formData.get('readStatus');

  // Create a new book object
  const newBook = new Books(author, title, `${pages} pages`, readStatus);
  
  displayBooks();

  // Reset the form fields and close the dialog
  newBookForm.reset();
  newBookDialog.close();

});


let book1 = new Books("The Alchemist" , "Paulo Coelho", "420 pages", "true");
let book2 = new Books("The KIte Runner" , "Khaled Hosseini", "500 pages", "false");
let book3 = new Books("A Thousand Splendid Suns" , "Khaled Hosseini", "570 pages", "true");
let book4 = new Books("Stay with Me" , "Ayobami Adebayo" , "870 pages", "true");
let book5 = new Books("Metamorphosis" , "Franz Kafka" , "350 pages", "true");
let book6 = new Books("Trial" , "Franz Kafka" , "500 pages", "false");
let book7 = new Books("The Songs of Achilles" , "Madeline Miller" , "900 pages", "true");
let book8 = new Books("Wanderlust" , "Danielle Steel" ,"705 pages", "true");
let book9 = new Books("Days at the Morisaki Bookshop" , "Eric Ozawa" ,"300 pages", "true");
let book10 = new Books("Tomorrow I Become a Woman" ,"Aiwanose Odafen" , "613 pages", "true");
let book11 = new Books("The Vanishing Half" , "Brit Bennett" ,"450 pages", "true");
let book12 = new Books("The Vegetarian","Han Kang","200 pages", "true");
let book13 = new Books("The Seven Husbands of Evelyn Hugo" ,"Taylor Jenkins Reid" , "389 pages", "true");
let book14 = new Books("Nearly all men in Lagos are mad" ,"Damilare Kuku" , "254 pages", "true");
let book15 = new Books("Mine Boy" ,"Peter Abrahams" , "261 pages", "true");
let book16 = new Books("Home Going" ,"Yaa Gyasi" , "305 pages", "true");
let book17 = new Books("The Little Prince" ,"Antoine De Saint-Exupery" , "96 pages", "true");
let book18 = new Books("The Three of us" ,"Ore Agbaje-Williams" , "192 pages", "true");
let book19 = new Books("Everything I never told you" ,"Celest Ng" , "297 pages", "false");
let book20 = new Books("Under the Udala Trees" ,"Chinelo Okparanta" , "328 pages", "false");
let book21 = new Books("I do not come to you by chance" ,"Adaobi Tricia Nwaubani" , "402 pages", "false");
let book22 = new Books("No Plan B" ,"Lee Child" , "336 pages", "false");
let book23 = new Books("River Secrets" ,"Shannon Hale" , "290 pages", "false");
let book24 = new Books("Snow falling on Cedars" ,"David Guterson" , "460 pages", "false");
let book25 = new Books("Never Lie" ,"Freida McFdden" , "296 pages", "false");
let book26 = new Books("Powerless" ,"Lauren Roberts" , "523 pages", "false");
let book27 = new Books("Powerful" ,"Lauren Roberts" , "272 pages", "false");
let book28 = new Books("Fearless" ,"Lauren Roberts" , "608 pages", "false");
let book29 = new Books("Reckless" ,"Lauren Roberts" , "396 pages", "false");
let book30 = new Books("Fourth Wing" ,"Rebecca Yarros" , "517 pages", "false");
 

displayBooks();

  
  
