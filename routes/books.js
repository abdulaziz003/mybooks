const path = require('path');

const express = require('express');
const router = express.Router();

// Import Book model to create new Book
const Book = require('../models/book');
// Import Author model to send the authors to the create new book page
const Author = require('../models/author');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// Get all Books Route
router.get('/', async (req, res)=>{
  let query = Book.find();
  if(req.query.title != null && req.query.title !=''){
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if(req.query.publishedBefore != null && req.query.publishedBefore !=''){
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if(req.query.publishedAfter != null && req.query.publishedAfter !=''){
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try{
    const books = await query.exec();
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    });
  }catch{
    res.redirect('/');
  }
});

// Display Create new Authors Form Route
router.get('/new', async (req, res)=>{
  renderNewPage(res, new Book());
});



// POST - Create new Author function Router with filePond where we don't need to use enctype="multipart/form-data"
// we will save the image to Database
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  // Saving the book 
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch (err) {
    renderNewPage(res, book, true);
  }
});


// Route to show a book
router.get('/:id', async (req, res)=>{
  try{
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.render('books/show', {book: book});
  }catch{
    res.redirect('/books');
  }
})

// Route to edit a book
router.get('/:id/edit', async (req, res)=>{
  try{
    const book = await Book.findById(req.params.id);
    renderEditPage(res,book);
  }catch{
    res.redirect('/books');
  }
})

// Update a book route
router.put('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if(req.body.cover != null && req.body.cover != ''){
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch (err) {
    if(book != null){
      renderEditPage(res, book, true);
    }else{
      redirect('/books');
    }
  }
});

// Delete book Route
router.delete('/:id', async (req, res)=>{
  let book;
  try{
    book = await Book.findById(req.params.id);
    await book.remove();
    redirect('/books');
  }catch{
    if(book != null){
      res.render('show/new', {
        book: book,
        errorMessage: 'Could not remove the book'
      });
    }else{
      res.redirect('/books');
    }
  }
})

async function renderEditPage(res, book, hasError=false){
  renderFormPage(res,book, 'edit', hasError);
}
async function renderNewPage(res, book, hasError=false){
  renderFormPage(res,book, 'new', hasError);
}


// function to render pages
async function renderFormPage(res, book, form, hasError=false){
  try {
    const authors = await Author.find({});
    let params = {
      authors: authors,
      book: book
    }
    if(hasError) {
      if(form === 'edit'){
        params.errorMessage = 'Error Updating a Book!';
      }else{
        params.errorMessage = 'Error Creating a Book!';
      }
    }
    res.render(`books/${form}`, params);
  } catch {
    res.redirect('books');
  }
}

function saveCover(book, coverEncoded){
  if(coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

module.exports = router;