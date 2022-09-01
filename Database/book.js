const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN : String,
    title : String,
    authors : [Number],
    language : String,
    publishedDate : String,
    numOfPages : Number,
    category : [String],
    publications : Number,
});

// Creating a book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;