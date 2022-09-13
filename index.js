// BOOK MANAGEMENT API 

// dotenv package
require("dotenv").config();

// Express FrameWork
const express = require("express");

// Initializing express
const BookManager = express();

// Configuration
BookManager.use(express.json());

// Book API routes
const books = require("./bookAPI");

// Author API routes
const authors = require("./authorAPI");

// Publication API routes
const publications = require("./publicationAPI");

// Mongoose 
const mongoose = require("mongoose");

// Establish a connection with database
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection Established..."));

BookManager.use("/books", books);
BookManager.use("/authors", authors);
BookManager.use("/publications", publications);

BookManager.listen(3000, () => console.log("Server is running!!!"));