const express = require('express');
const path = require('path');
const log = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  prestito: {
    nome: String,
    cognome: String,
  }
});

const Book = mongoose.model('Book', bookSchema);

const app = express();

mongoose.connect(
  'mongodb://127.0.0.1:32768/books',
  function (err) {
    if (err) {
      console.log(err);
      return;
    }

    app.listen(3000);
  }
);

app.use( log('dev') );

app.set( 'views', path.resolve(__dirname, 'views') );
app.set( 'view engine', 'ejs' );

app.use( '/css', express.static( path.resolve(__dirname, 'css') ) );
app.use( '/js', express.static( path.resolve(__dirname, 'js') ) );

app.use( bodyParser.urlencoded( { extended : false } ) );

app.get( '/', function (req, res) {
  Book.find().exec( function (err, result) {
    res.render('index', {
      books: result
    });
  });
});

app.get( '/new-book', function (req, res) {
  res.render('new_book');
});

app.post( '/new-book', function (req, res) {
  console.log(req.body);
  //if (!req.body.title) {
  //}
  const book = new Book({
    title: req.body.title,
  });
  book.save().then( function () {
    res.redirect('/new-book');
  });
});

app.post( '/delete-book', function (req, res) {
  Book.remove( { _id: req.body.id }, function (err) {
    res.redirect('/');
  });
});

app.get( '/books/:id', function (req, res) {
  Book.find( { _id: req.params.id } ).exec( function (err, result) {
    res.render('book', {
      book: result[0],
    });
  });
});

app.post( '/book-update', function (req, res) {
  //if (!req.body.title) {
  //}
  
  Book.update({
    _id: req.body.id
  }, {
    title: req.body.title,
  }, function (err) {
    res.redirect('/');
  });
});

app.post('/prenota', function (req, res) {
  console.log(req.body);
  Book.update({
    _id: req.body.id,
  }, {
    "prestito.nome": req.body.nome,
    "prestito.cognome": req.body.cognome
  }, function (err) {
    res.redirect('/');
  });
});

app.use( function (req, res) {
  res.status(404);
  res.end('page not found');
});
