// BOOK MANAGEMENT API 

// dotenv package
require("dotenv").config();

// Express FrameWork
const express = require("express");

// Mongoose 
const mongoose = require("mongoose");

// Import Database
const Database = require("./Database/index");

// Models
const BookModel = require("./Database/book");
const AuthorModel = require("./Database/author");
const PublicationModel = require("./Database/publication");

// Initializing express
const BookManager = express();

// Configuration
BookManager.use(express.json());

// Establish a connection with database
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection Established..."));

/* 
    Route : /
    Description : to get all books
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
BookManager.get("/", async (request, response) =>{
    const getAllBooks = await BookModel.find();
    return response.json({ Books : getAllBooks});
});

/* 
    Route : /b
    Description : to get specific books based on ISBN
    Access : PUBLIC
    Parameters : isbn
    Method : GET
*/
BookManager.get("/b/:isbn", async (request, response) =>{
    const getSpecificBook = await BookModel.findOne({ISBN : request.params.isbn});

    if(!getSpecificBook){
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
BookManager.get("/c/:category", async (request, response) =>{
    const getListOfBook = await BookModel.findOne({ category : request.params.category});

    if(!getListOfBook){
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
BookManager.get("/a/:author", async (request, response) =>{
    const getListOfBook = await BookModel.findOne({ authors : request.params.author});

    if(!getListOfBook){
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
BookManager.get("/authors", async (request, response) =>{
    const getAllAuthors = await AuthorModel.find();
    return response.json({ Authors : getAllAuthors});
});

/* 
    Route : /author
    Description : to get specific author
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
BookManager.get("/author/:id", async (request, response) =>{
    const getSpecificAuthor = await AuthorModel.findOne({id : request.params.id});

    if(!getSpecificAuthor){
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
BookManager.get("/a/book/:isbn", async (request, response) =>{
    const getSpecificAuthorBook = await AuthorModel.findOne({books : request.params.isbn});

    if(!getSpecificAuthorBook){
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
BookManager.get("/publications", async (request, response) =>{
    const getAllPublications = await PublicationModel.find();
    return response.json({ Publications :getAllPublications});
});

/* 
    Route : /p/id
    Description : to get specific publication 
    Access : PUBLIC
    Parameters : publication Id
    Method : GET
*/
BookManager.get("/p/:id", async (request, response) =>{
    const getSpecificPublication = await PublicationModel.findOne({id : request.params.id});

    if(!getSpecificPublication){
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
BookManager.get("/p/book/:isbn", async (request, response) =>{
    const getListOfPublications = await PublicationModel.findOne({ books : request.params.isbn});

    if(!getListOfPublications){
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
BookManager.post("/book/new", async (request, response) =>{
    const { newBook } = request.body;
    await BookModel.create(newBook);
    return response.json({Message : "New Book is added"});
});

/* 
    Route : /author/new/post
    Description : to post a new Author
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/author/new/post", async (request, response) =>{
    const { newAuthor } = request.body;
    await AuthorModel.create(newAuthor);
    return response.json({Message : "New Author is added"});
});

/* 
    Route : /publications/new
    Description : to post a new publication
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/publication/new", async (request, response) =>{
    const { newPublication } = request.body;
    await PublicationModel.create(newPublication);
    return response.json({Message : "New Publication is added"});
});

/* 
    Route : /book/update/
    Description : Update book title
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/book/update/:isbn", async (request, response) =>{
    const updatedBooks = await BookModel.findOneAndUpdate(
        { ISBN : request.params.isbn},
        {$set: {title : request.body.newTitle}},
        {new : true,}
    );
    return response.json({books : updatedBooks});
});

/* 
    Route : /book/author/update/
    Description : update/add new author
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/book/author/update/:isbn", async (request, response) =>{

    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN : request.params.isbn}, 
        {$addToSet: {authors : request.body.newAuthor}},
        {new : true}
    );

    // update the author database
    const updatedAuthors = await AuthorModel.updateOne(
        {id : request.body.newAuthor}, 
        {$addToSet: {books : request.params.isbn}},
        {new : true}
    );

    return response.json({books: updatedBook, authors: updatedAuthors});
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
BookManager.delete("/book/delete/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndDelete(
        {ISBN : request.params.isbn}
    );
    // const updatedBookDatabase = Database.books.filter((book) => book.ISBN !== request.params.isbn);
    Database.books = updatedBookDatabase;
    return response.json({books : updatedBook });
});

/* 
    Route : /book/delete/author
    Description : Delete an author from a book 
    Access : PUBLIC
    Parameters : ISBN, authorId
    Method : DELETE
*/
BookManager.delete("/book/delete/author/:isbn/:authorId", async (request, response) => {
    // Delete an author from book database
    const updatedBooks = await BookModel.findOneAndUpdate(
        {ISBN : request.params.isbn},
        {$pull : {authors :parseInt(request.params.authorId)}},
        {new : true}
    )

    // Delete a book from author database
    const updatedAuthors = await AuthorModel.findOneAndUpdate(
        {id : parseInt(request.params.authorId)},
        {$pull : {books : request.params.isbn}},
        {new : true}
    )

    return response.json({books : updatedBooks, authors : updatedAuthors});
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