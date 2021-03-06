// Check if we are running in the dev or local
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

// import body-parser to read posted data
const bodyParser = require('body-parser');


// Importing Routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

// Setting the view engine
app.set('view engine', 'ejs');
// Setting the views files location
app.set('views', __dirname+'/views');
// Hock up the layout location
app.set('layout', 'layouts/layout');
// using the express-ejs-layouts
app.use(expressLayouts);
// using method-override to send request to the server like 'delete' and 'put'
app.use(methodOverride('_method'));
// Setting the location for static files e.g.(css, js, images)
app.use(express.static('public'));
// User body-parser with express
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

// Import mongoose to the application
const mongoose = require('mongoose');
// Define connection with local mongoDB 
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
// Start connection with mongoDB
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to mongoDB :) '));



// Use the imported Router
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);




// Run the server to listen on the PORT
app.listen(process.env.PORT || 3000);