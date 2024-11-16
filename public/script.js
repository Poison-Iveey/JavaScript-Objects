let allBooks = [];  //  this array holds all the book objects

function Books(tittle,author,pages,isRead){    // this () creates  new object with the all the books properties then pushes that object into allBooks() array
    this.tittle = tittle;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead === "true";
    this.displayInfo = function(){
        let readStatus;
         if (this.isRead) {
          readStatus = "already read";
      } else {
          readStatus = "not read yet";
      }
      return `${this.tittle} by ${this.author}, ${this.pages} , ${readStatus}`;

        
    };

    allBooks.push(this);

}


function displayBooks() {
    const container = document.getElementById("book-container"); 

    allBooks.forEach(function(book) {
        const bookCards = document.createElement('div');
        bookCards.classList.add(
            "border", "border-gray-300", "p-5", "rounded-lg", "w-48", "text-center"
        );

        const bookInfo = document.createElement("p");
        bookInfo.textContent = book.displayInfo();  // Get the information from the displayInfo method
        bookInfo.classList.add("text-sm", "m-0");

        bookCards.appendChild(bookInfo);
        container.appendChild(bookCards)

    
    });  
}


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

displayBooks();

