const mongoose = require("mongoose");

// Creating a Author schema
const AuthorSchema = mongoose.Schema({
    id : Number,
    name : String,
    books : [String],
});

// Creating a Author model
const AuthorModel = mongoose.model("Authors", AuthorSchema);

module.exports = AuthorModel;