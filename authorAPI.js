// Express FrameWork
const express = require("express");

// Initializing express
const BookManager = express.Router();

// Model
const AuthorModel = require("./Database/author");
/* 
    Route : /
    Description : to get all authors
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
BookManager.get("/", async (request, response) =>{
    const getAllAuthors = await AuthorModel.find();
    return response.json({ Authors : getAllAuthors});
});

/* 
    Route : /
    Description : to get specific author
    Access : PUBLIC
    Parameters : id
    Method : GET
*/
BookManager.get("/:id", async (request, response) =>{
    const getSpecificAuthor = await AuthorModel.findOne({id : request.params.id});

    if(!getSpecificAuthor){
        return response.json({error : `No Book Found with Id number ${request.params.id}`});
    }
    return response.json({Author : getSpecificAuthor});
});

/* 
    Route : /book
    Description : to get a list of authors based on book's ISBN
    Access : PUBLIC
    Parameters : ISBN of Book
    Method : GET
*/
BookManager.get("/book/:isbn", async (request, response) =>{
    const getSpecificAuthorBook = await AuthorModel.findOne({books : request.params.isbn});

    if(!getSpecificAuthorBook){
        return response.json({error : `No Book Found with ISBN number ${request.params.isbn}`});
    }
    return response.json({Books : getSpecificAuthorBook});
});

/* 
    Route : /post
    Description : to post a new Author
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/post", async (request, response) =>{
    const { newAuthor } = request.body;
    await AuthorModel.create(newAuthor);
    return response.json({Message : "New Author is added"});
});

/* 
    Route : /update
    Description : Update author details i.e name
    Access : PUBLIC
    Parameters : id
    Method : PUT
*/
BookManager.put("/update/:id", async (request, response) =>{
    const authorName = await AuthorModel.findOneAndUpdate(
        {id : parseInt(request.params.id)},
        {name : request.body.authorName},
        {new : true}
    )
    return response.json({Authors : authorName});
});

/* 
    Route : /delete
    Description : Delete an Author
    Access : PUBLIC
    Parameters : ID
    Method : DELETE
*/
BookManager.delete("/delete/:id", async (request, response) => {
    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete(
        {id : parseInt(request.params.id)}
    )
    return response.json({authors : updatedAuthorDatabase });
});

module.exports = BookManager;