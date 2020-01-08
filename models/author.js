const mongoose = require('mongoose');

const Book = require('./book');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

// this function will run before deleting an author
// to prevent deleting author with books linked to him or her
authorSchema.pre('remove', function(next){
  Book.find({author: this.id}, (err, book)=>{
    if(err){
      next(err);
    }else if(book.length > 0){
      next(new Error('This Author has books linked !'));
    }else{
      next();
    }
  });
});


module.exports = mongoose.model('Author', authorSchema);