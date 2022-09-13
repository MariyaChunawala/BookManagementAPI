let books = [
    {
        ISBN : "12345ONE",
        title : "Getting Started with MERN",
        authors : [1],
        language : "en",
        publishedDate : "2022-07-28",
        numOfPages : 255,
        category : ['fiction', 'Programming', "TECH"],
        publications : 1,
    },
    {
        ISBN : "12345TWO",
        title : "Getting Started with Java",
        authors : [1, 2],
        language : "en",
        publishedDate : "2022-07-28",
        numOfPages : 255,
        category : ['fiction', 'Programming'],
        publications : 1,
    },
];

const authors = [
    {
        id : 1,
        name : "Mariya",
        books : ["12345ONE", "12345TWO"],
    },
    {
        id : 2,
        name : "Taher",
        books : ["12345ONE"],
    },
];

const publications = [
    {
        id : 1,
        name : "Chakra",
        books : ["12345ONE"],
    },
    {
        id : 2,
        name : "McGrawHill",
        books : ["12345ONE", "12345TWO"],
    },
];

export default {books, authors, publications};