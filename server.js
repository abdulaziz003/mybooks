// Check if we are running in the dev or local
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');


// Importing Routes
const indexRouter = require('./routes/index');

// Setting the view engine
app.set('view engine', 'ejs');
// Setting the views files location
app.set('views', __dirname+'/views');
// Hock up the layout location
app.set('layout', 'layouts/layout');
// using the express-ejs-layouts
app.use(expressLayouts);
// Setting the location for static files e.g.(css, js, images)
app.use(express.static('public'));

// Import mongoose to the application
const mongoose = require('mongoose');
// Define connection with local mongoDB 
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
// Start connection with mongoDB
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to mongoDB :) '));



// Use the indexRouter
app.use('/', indexRouter);




// Run the server to listen on the PORT
app.listen(process.env.PORT || 3000 ,()=> console.log('Server is running on port 3000'));