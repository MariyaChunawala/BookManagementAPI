// BOOK MANAGEMENT API 

// Express FrameWork
const { response } = require("express");
const express = require("express");

// Import Database
const Database = require("./Database/index");

// Initializing express
const BookManager = express();

// Configuration
BookManager.use(express.json());

/* 
    Route : /
    Description : to get all books
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
BookManager.get("/", (request, response) =>{
    return response.json({ Books : Database.books});
});

/* 
    Route : /b
    Description : to get specific books based on ISBN
    Access : PUBLIC
    Parameters : isbn
    Method : GET
*/
BookManager.get("/b/:isbn", (request, response) =>{
    const getSpecificBook = Database.books.filter((book) => book.ISBN === request.params.isbn);

    if(getSpecificBook.length === 0){
        return response.json({error : `No Book Found with ISBN number ${request.params.isbn}`});
    }
    return response.json({Book : getSpecificBook});
});

/* 
    Route : /c
    Description : to get a list of books based on category
    Access : PUBLIC
    Parameters : category
    Method : GET
*/
BookManager.get("/c/:category", (request, response) =>{
    const getListOfBook = Database.books.filter((book) => book.category.includes(request.params.category));

    if(getListOfBook.length === 0){
        return response.json({error : `No Book Found with category number ${request.params.category}`});
    }
    return response.json({Book : getListOfBook});
});

/* 
    Route : /a
    Description : to get a list of books based on author
    Access : PUBLIC
    Parameters : author
    Method : GET
*/
BookManager.get("/a/:author", (request, response) =>{
    const getListOfBook = Database.books.filter((book) => book.authors.includes(parseInt(request.params.author)));

    if(getListOfBook.length === 0){
        return response.json({error : `No Book Found with author number ${request.params.author}`});
    }
    return response.json({Book : getListOfBook});
});

/* 
    Route : /authors
    Description : to get all authors
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
BookManager.get("/authors", (request, response) =>{
    return response.json({ Authors : Database.authors});
});

/* 
    Route : /author
    Description : to get specific author
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
BookManager.get("/author/:id", (request, response) =>{
    const getSpecificAuthor = Database.authors.filter((author) => author.id === parseInt(request.params.id));

    if(getSpecificAuthor.length === 0){
        return response.json({error : `No Book Found with Id number ${request.params.id}`});
    }
    return response.json({Author : getSpecificAuthor});
});

/* 
    Route : /a/book
    Description : to get a list of authors based on book's ISBN
    Access : PUBLIC
    Parameters : ISBN of Book
    Method : GET
*/
BookManager.get("/a/book/:isbn", (request, response) =>{
    const getSpecificAuthorBook = Database.authors.filter((author) => author.books.includes(request.params.isbn));

    if(getSpecificAuthorBook.length === 0){
        return response.json({error : `No Book Found with ISBN number ${request.params.isbn}`});
    }
    return response.json({Books : getSpecificAuthorBook});
});

/* 
    Route : /publications
    Description : to get all publications
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
BookManager.get("/publications", (request, response) =>{
    return response.json({ Publications : Database.publications});
});

/* 
    Route : /p/id
    Description : to get specific publication 
    Access : PUBLIC
    Parameters : publication Id
    Method : GET
*/
BookManager.get("/p/:id", (request, response) =>{
    const getSpecificPublication = Database.publications.filter((publication) => publication.id === parseInt(request.params.id));

    if(getSpecificPublication.length === 0){
        return response.json({error : `No Book Found with publication id number ${request.params.id}`});
    }
    return response.json({publications : getSpecificPublication});
});

/* 
    Route : /p/book
    Description : to get a list of publications based on book 
    Access : PUBLIC
    Parameters : Book ISBN
    Method : GET
*/
BookManager.get("/p/book/:isbn", (request, response) =>{
    const getListOfPublications = Database.publications.filter((publication) => publication.books.includes(request.params.isbn));

    if(getListOfPublications.length === 0){
        return response.json({error : `No Publication Found with Book ISBN number ${request.params.isbn}`});
    }
    return response.json({publications : getListOfPublications});
});


/* 
    Route : /book/new
    Description : to post a new Book
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/book/new", (request, response) =>{
    const { newBook } = request.body;
    Database.books.push(newBook);
    return response.json({Books : Database.books, Message : "New Book is added"});
});

/* 
    Route : /author/new/post
    Description : to post a new Author
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/author/new/post", (request, response) =>{
    const { newAuthor } = request.body;
    Database.authors.push(newAuthor);
    return response.json({Author : Database.authors, Message : "New Author is added"});
});

/* 
    Route : /publications/new
    Description : to post a new publication
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/publication/new", (request, response) =>{
    const { newPublication } = request.body;
    Database.publications.push(newPublication);
    return response.json({Publications : Database.publications, Message : "New Publication is added"});
});

/* 
    Route : /book/update/
    Description : Update book title
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/book/update/:isbn", (request, response) =>{
    Database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn){
            book.title = request.body.bookTitle;
            return;
        }
    })
    return response.json({books : Database.books});
});

/* 
    Route : /book/author/update/
    Description : update/add new author
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/book/author/update/:isbn", (request, response) =>{
    // update the book database
    Database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn){
            return book.authors.push(request.body.newAuthor);
        }
    })

    // update the author database
    Database.authors.forEach((author) => {
        if(author.id === request.body.newAuthor){
            return author.books.push(request.params.isbn);
        }
    })

    return response.json({books: Database.books, authors: Database.authors});
});

/* 
    Route : /author/update/
    Description : Update author details i.e name
    Access : PUBLIC
    Parameters : id
    Method : PUT
*/
BookManager.put("/author/update/:id", (request, response) =>{
    Database.authors.forEach((author) => {
        if(author.id === parseInt(request.params.id)){
            author.name = request.body.authorName;
            return;
        }
    })
    return response.json({Authors : Database.authors});
});

/* 
    Route : /publication/update/
    Description : Update Publication details i.e name
    Access : PUBLIC
    Parameters : id
    Method : PUT
*/
BookManager.put("/publication/update/:id", (request, response) =>{
    Database.publications.forEach((publication) => {
        if(publication.id === parseInt(request.params.id)){
            publication.name = request.body.publicationName;
            return;
        }
    })
    return response.json({Publications : Database.publications});
});

/* 
    Route : /publication/update/book/
    Description : Udpate/add new book to a publications
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/publication/update/book/:isbn", (request, response) =>{
    // update the publication database
    Database.publications.forEach((publication) => {
        if(publication.id === request.body.newPublication){
            return publication.books.push(request.params.isbn);
        }
    })

    // update the book database
    Database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn){
            book.publications = request.body.newPublication;
            return;
        }
    })

    return response.json({books: Database.books, publications: Database.publications});
});

/* 
    Route : /book/delete/
    Description : Delete a book
    Access : PUBLIC
    Parameters : ISBN
    Method : DELETE
*/
BookManager.delete("/book/delete/:isbn", (request, response) => {
    const updatedBookDatabase = Database.books.filter((book) => book.ISBN !== request.params.isbn);
    Database.books = updatedBookDatabase;
    return response.json({books : Database.books });
});

/* 
    Route : /book/delete/author
    Description : Delete an author from a book 
    Access : PUBLIC
    Parameters : ISBN, authorId
    Method : DELETE
*/
BookManager.delete("/book/delete/author/:isbn/:authorId", (request, response) => {
    // Delete an author from book database
    Database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn){
            const updatedAuthorList = book.authors.filter((author) => author !== parseInt(request.params.authorId));
            book.authors = updatedAuthorList;
            return;
        }
    });

    // Delete a book from author database
    Database.authors.forEach((author) => {
        if(author.id === parseInt(request.params.authorId)){
            const updatedBookList = author.books.filter((book) => book !== request.params.isbn);
            author.books = updatedBookList;
            return;
        }
    })

    return response.json({books : Database.books, authors : Database.authors});
});

/* 
    Route : /author/delete/
    Description : Delete an Author
    Access : PUBLIC
    Parameters : ID
    Method : DELETE
*/
BookManager.delete("/author/delete/:id", (request, response) => {
    const updatedAuthorDatabase = Database.authors.filter((author) => author.id !== parseInt(request.params.id));
    Database.authors = updatedAuthorDatabase;
    return response.json({authors : Database.authors });
});

/* 
    Route : /publication/delete/
    Description : Delete a publication
    Access : PUBLIC
    Parameters : ID
    Method : DELETE
*/
BookManager.delete("/publication/delete/:id", (request, response) => {
    const updatedPublicationDatabase = Database.publications.filter((publication) => publication.id !== parseInt(request.params.id));
    Database.publications = updatedPublicationDatabase;
    return response.json({publications : Database.publications });
});

/* 
    Route : /publication/delete/book
    Description : Delete a book from publication
    Access : PUBLIC
    Parameters : ISBN, publication ID
    Method : DELETE
*/
BookManager.delete("/publication/delete/book/:isbn/:publicationID", (request, response) => {
    // update publication database
    Database.publications.forEach((publication) => {
        if(publication.id === parseInt(request.params.publicationID)){
            const updatedPublicationDatabase = publication.books.filter((book) => book !== request.params.isbn);
            publication.books = updatedPublicationDatabase;
            return;
        }
    });

    // update book database
    Database.books.forEach((book) => {
        if(book.ISBN === request.params.isbn){
            book.publications = 0;
            return;
        }
    });

    return response.json({books : Database.books, publications : Database.publications});
});

BookManager.listen(3000, () => console.log("Server is running!!!"));