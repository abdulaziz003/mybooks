const express = require('express');
const router = express.Router();

// Import Author model to create new Author
const Author = require('../models/author');

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

// Display Create new Authors Form Route
router.get('/new', (req, res)=>{
  res.render('authors/new', {author: new Author()});
});

// POST - Create new Author function Router
router.post('/', async (req, res)=>{
  const author = new Author({
    name: req.body.name
  });

  try {
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect('authors/');
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'error creating Author'
    })
  }

  // ====Old way to handle saving to mongoDB====
    // author.save((err, newAuthor)=>{
    //   if(err){
    //     res.render('authors/new', {
    //       author: author,
    //       errorMessage: 'error creating Author!'
    //     });
    //   }else{
    //     //res.redirect(`authors/${newAuthor.id}`);
    //     res.redirect(`authors`);
    //   }
    // });
  //=============================================
});

module.exports = router;