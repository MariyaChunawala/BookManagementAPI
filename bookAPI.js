// Express FrameWork
const express = require("express");

// Initializing express
const BookManager = express.Router();

// Models
const BookModel = require("./Database/book");
const AuthorModel = require("./Database/author");

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
    Route : /
    Description : to get specific books based on ISBN
    Access : PUBLIC
    Parameters : isbn
    Method : GET
*/
BookManager.get("/:isbn", async (request, response) =>{
    const getSpecificBook = await BookModel.findOne({ISBN : request.params.isbn});

    if(!getSpecificBook){
        return response.json({error : `No Book Found with ISBN number ${request.params.isbn}`});
    }
    return response.json({Book : getSpecificBook});
});

/* 
    Route : /category
    Description : to get a list of books based on category
    Access : PUBLIC
    Parameters : category
    Method : GET
*/
BookManager.get("/category/:category", async (request, response) =>{
    const getListOfBook = await BookModel.findOne({ category : request.params.category});

    if(!getListOfBook){
        return response.json({error : `No Book Found with category number ${request.params.category}`});
    }
    return response.json({Book : getListOfBook});
});

/* 
    Route : /author
    Description : to get a list of books based on author
    Access : PUBLIC
    Parameters : author
    Method : GET
*/
BookManager.get("/author/:author", async (request, response) =>{
    const getListOfBook = await BookModel.findOne({ authors : request.params.author});

    if(!getListOfBook){
        return response.json({error : `No Book Found with author number ${request.params.author}`});
    }
    return response.json({Book : getListOfBook});
});

/* 
    Route : /post
    Description : to post a new Book
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/post", async (request, response) =>{
    const { newBook } = request.body;
    await BookModel.create(newBook);
    return response.json({Message : "New Book is added"});
});

/* 
    Route : /update/
    Description : Update book title
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/update/:isbn", async (request, response) =>{
    const updatedBooks = await BookModel.findOneAndUpdate(
        { ISBN : request.params.isbn},
        {$set: {title : request.body.newTitle}},
        {new : true,}
    );
    return response.json({books : updatedBooks});
});

/* 
    Route : /author/update/
    Description : update/add new author
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/author/update/:isbn", async (request, response) =>{

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
    Route : /delete
    Description : Delete a book
    Access : PUBLIC
    Parameters : ISBN
    Method : DELETE
*/
BookManager.delete("/delete/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndDelete(
        {ISBN : request.params.isbn}
    );
    // const updatedBookDatabase = Database.books.filter((book) => book.ISBN !== request.params.isbn);
    return response.json({books : updatedBook });
});

/* 
    Route : /delete/author
    Description : Delete an author from a book 
    Access : PUBLIC
    Parameters : ISBN, authorId
    Method : DELETE
*/
BookManager.delete("/delete/author/:isbn/:authorId", async (request, response) => {
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

module.exports = BookManager;