// Express FrameWork
const express = require("express");

// Initializing express
const BookManager = express.Router();

// Models
const PublicationModel = require("./Database/publication");
const BookModel = require("./Database/book");
/* 
    Route : /
    Description : to get all publications
    Access : PUBLIC
    Parameters : NONE
    Method : GET
*/
BookManager.get("/", async (request, response) =>{
    const getAllPublications = await PublicationModel.find();
    return response.json({ Publications :getAllPublications});
});

/* 
    Route : /
    Description : to get specific publication 
    Access : PUBLIC
    Parameters : publication Id
    Method : GET
*/
BookManager.get("/:id", async (request, response) =>{
    const getSpecificPublication = await PublicationModel.findOne({id : request.params.id});

    if(!getSpecificPublication){
        return response.json({error : `No Book Found with publication id number ${request.params.id}`});
    }
    return response.json({publications : getSpecificPublication});
});

/* 
    Route : /book
    Description : to get a list of publications based on book 
    Access : PUBLIC
    Parameters : Book ISBN
    Method : GET
*/
BookManager.get("/book/:isbn", async (request, response) =>{
    const getListOfPublications = await PublicationModel.findOne({ books : request.params.isbn});

    if(!getListOfPublications){
        return response.json({error : `No Publication Found with Book ISBN number ${request.params.isbn}`});
    }
    return response.json({publications : getListOfPublications});
});

/* 
    Route : /post
    Description : to post a new publication
    Access : PUBLIC
    Parameters : NONE
    Method : POST
*/
BookManager.post("/post", async (request, response) =>{
    await PublicationModel.create(request.body.pub);
    return response.json({Message : "New Publication is added"});
});

/* 
    Route : /update
    Description : Update Publication details i.e name
    Access : PUBLIC
    Parameters : id
    Method : PUT
*/
BookManager.put("/update/:id", async (request, response) =>{
    const publicationName = await PublicationModel.findOneAndUpdate(
        {id : parseInt(request.params.id)},
        {name : request.body.publicationName},
        {new : true}
    )

    return response.json({Publications : publicationName});
});

/* 
    Route : /update/book/
    Description : Udpate/add new book to a publications
    Access : PUBLIC
    Parameters : ISBN
    Method : PUT
*/
BookManager.put("/update/book/:isbn", async (request, response) =>{
    // update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {id : request.body.newPublication},
        {$addToSet: {books : request.params.isbn}},
        {new : true}
    )

    // update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {ISBN : request.params.isbn},
        {$set : {publications : request.body.newPublication}},
        {new : true}
    )

    return response.json({books: updatedBook, publications: updatedPublication});
});

/* 
    Route : /delete/
    Description : Delete a publication
    Access : PUBLIC
    Parameters : ID
    Method : DELETE
*/
BookManager.delete("/delete/:id", async (request, response) => {
    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete(
        {id : parseInt(request.params.id)}
    )
    return response.json({authors : updatedPublicationDatabase });
});

/* 
    Route : /delete/book
    Description : Delete a book from publication
    Access : PUBLIC
    Parameters : ISBN, publication ID
    Method : DELETE
*/
BookManager.delete("/delete/book/:isbn/:publicationID", async (request, response) => {
    // update publication database
    const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
        {id : parseInt(request.params.publicationID)},
        {$pull : {books : request.params.isbn}},
        {new : true}
    );

    // update book database
    const updatedBookDatabase = await BookModel.findOneAndUpdate(
        {ISBN : request.params.isbn},
        {publications : 0},
        {new : true}
    )

    return response.json({books : updatedPublicationDatabase, publications : updatedBookDatabase});
});

module.exports = BookManager;