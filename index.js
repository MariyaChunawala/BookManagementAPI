// Express FrameWork
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
BookManager.listen(3000, () => console.log("Server is running!!!"));