const mongoose = require("mongoose");

// Creating a Publication schema
const PublicationSchema = mongoose.Schema({
    id : Number,
    name : String,
    books : [String],
});

// Creating a Publication model
const PublicationModel = mongoose.model("Publications", PublicationSchema);

module.exports = PublicationModel;