const express = require('express');
const router = express.Router();

// Import Author model to create new Author
const Author = require('../models/author');
const Book = require('../models/book');

// Get all Authors Route
router.get('/', async (req, res)=>{
  let searchOptions = {};
  if(req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name, 'i');// i means not case sensitive 
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    });
  } catch {
    res.redirect('/');
  }
});

// POST - Create new Author function Router
router.post('/', async (req, res)=>{
  const author = new Author({
    name: req.body.name
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'error creating Author'
    })
  }
});

// Display Create new Authors Form Route
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});


// Show Author
router.get('/:id', async (req, res)=>{
  try{
    const author = await Author.findById(req.params.id);
    const books = await Book.find({author: author.id});
    res.render('authors/show',{
      author: author,
      booksByAuthor: books
    });

  }catch{
    res.redirect('/authors');
  }
});


// Edit Author
router.get('/:id/edit', async (req, res)=>{
  try{
    const author = await Author.findById(req.params.id);
    res.render('authors/edit', {author : author });
  }catch{
    res.redirect('authors');
  }
});

// Update Author
router.put('/:id', async (req, res)=>{
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if(author == null){
      res.redirect('authors');
    }else{
      res.render('authors/edit', {
        author: author,
        errorMessage: 'error updating an Author'
      })
    }
  }
});

// Delete Author
router.delete('/:id', async (req, res)=> {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch {
    if (author == null) {
      res.redirect('authors');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;