const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bookModel = require('./model');
const bookshelfModel = require('./bookshelf-model');

const port = 3000
const app = express()
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/zettacamp');

//read
app.get('/books', jwtAuth, async (req, res) => {
    const books = await bookModel.find({});
    try {
        res.send(books);
    } catch (err) {
        res.status(500).send(err);
    }
});

//create
app.post('/books', jwtAuth, async (req, res) => {
    const books = new bookModel(req.body);
    try {
        await books.save();
        res.send("Berhasil Menambahkan Buku");
    } catch (err) {
        res.status(500).send(err);
    }
});

//update
app.patch('/books/:id', jwtAuth, async (req, res) => {
    try {
        await bookModel.findByIdAndUpdate(req.params.id, req.body);
        res.send("Berhasil Mengubah Buku");
    } catch (err) {
        res.status(500).send(err);
    }
});

//delete
app.delete('/books/:id', jwtAuth, async (req, res) => {
    try {
        await bookModel.findByIdAndDelete(req.params.id);
        res.send("Berhasil Menghapus Buku");
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/books/find/:name', jwtAuth, async (req, res) => {
  const books = await bookModel.find({'name' : req.params.name});
  try {
      res.send(books);
  } catch (err) {
      res.status(500).send(err);
  }
});

//get all bookshelf
app.get('/bookshelf', jwtAuth, async (req, res) => {
  const bookshelf = await bookshelfModel.find({});
  try {
      res.send(bookshelf);
  } catch (err) {
      res.status(500).send(err);
  }
})

//insert bookshelf
app.post('/bookshelf', jwtAuth, async (req,res) =>{
  const bookshelf = new bookshelfModel(req.body);
  try {
      await bookshelf.save();
      res.send("Berhasil Menambahkan Rak Buku");
  } catch (err) {
      res.status(500).send(err);
  }
});

app.get('/bookshelf/book/:id/:id2', jwtAuth, async (req, res) => {
  const bookshelf = await bookshelfModel.find({book_id:{ $elemMatch : {$in: [req.params.id, req.params.id2]}}});
  try {
      res.send(bookshelf);
  } catch (err) {
      res.status(500).send(err);
  }
});

app.get('/bookshelf/book/:id', jwtAuth, async (req, res) => {
  const bookshelf = await bookshelfModel.find({book_id:{ $elemMatch : {$in: [req.params.id]}}});
  try {
      res.send(bookshelf);
  } catch (err) {
      res.status(500).send(err);
  }
});

//update bookshelf
app.patch('/bookshelf/:id', jwtAuth, async (req, res) => {
  try {
      const result = await bookshelfModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
      res.send(result);
  } catch (err) {
      res.status(500).send(err);
  }
});

//delete bookshelf
app.delete('/bookshelf/:id', jwtAuth, async (req, res) => {
  try {
      await bookshelfModel.findByIdAndDelete(req.params.id);
      res.send("Berhasil Menghapus Bookshelf");
  } catch (err) {
      res.status(500).send(err);
  }
});

function generateAccessToken(payload) {
  return jwt.sign(payload, 'secret');
}

app.post('/api/maketoken', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = generateAccessToken({ username: username, password: password });

  res.send({token : token});
})

function jwtAuth(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth.split(' ')[1];

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403)
    console.log("antum user asli");
    req.user = user.username;
    next()
  })
}

app.get('/api/buybook', jwtAuth, async(req, res) => {
  const username = req.user;
  const books = req.body;
  const bookInformation = [
    books.bookName,
    books.discount,
    books.tax,
    books.bookStock,
    books.bookPurchase,
    books.terms,
    books.addtionalTerms]
  const transaction = await book(...bookInformation);
  const result = {username : username, transaction: transaction};
  res.send(result)
})

async function book(bookName, discount, tax, bookstock, bookpurchase, terms, addtionalTerms) {
  let price = 1000;
  const priceAfterDiscount = price - ((price * discount) / 100);
  price = priceAfterDiscount + ((priceAfterDiscount * tax) / 100);
  let totalPrice = 0;
  for (let i = 0; i < bookpurchase; i++) {
    totalPrice = totalPrice + price;
    if (bookstock === 0) {
      return `You cannot buy more than in stock. 
      \nStock = ${bookstock}
      \nYou Bought = ${i} books, ${bookpurchase-i} books left.`;
    } else {
      totalPrice += price;
      bookstock--;
    }
  }
  let termEachMonth = await calculateTerm(terms, totalPrice);
  // console.log(termEachMonth);
  let credit = await calculateCredit(termEachMonth, totalPrice, bookName, terms, addtionalTerms);
  // console.log(credit);
  return credit;
};

function calculateTerm(terms, totalPrice) {
  const convTotalPrice = totalPrice / terms;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve (convTotalPrice);
    }, 0);
  });
}

async function calculateNewTerm(termEachMonth, addtionalTerms) {
  return termEachMonth + addtionalTerms
};

async function calculateCredit(termEachMonth, totalPrice, bookName, terms, addtionalTerms) {
  let newTermEachMonth = await calculateNewTerm(termEachMonth, addtionalTerms);
  let creditPay = 0;
  let credit = [];
  for (let i = 0; i < terms; i++) {
    if (i === 2){
      credit.push( 
        {
        'Book Name' : bookName,
        Month : i+1,
        'New Price Credit To Be Paid' : newTermEachMonth,
        'Credit Already Paid' : creditPay = creditPay + newTermEachMonth,
        Remaining : totalPrice -= termEachMonth,
        }
      );
    } else {
      credit.push( 
        {
        'Book Name' : bookName,
        Month : i+1,
        'Credit To Be Paid' : termEachMonth,
        'Credit Already Paid' : creditPay = creditPay + termEachMonth,
        Remaining : totalPrice -= newTermEachMonth,
        }
      );
      if (credit[i].Remaining <= 0) {
        break;
      }
    }
    }
    
    return credit;
};

const fs = require('fs').promises;

app.get('/api/readfile',jwtAuth, (req, res) => {
  const file = readFile('text.txt');
  res.send("succes read file");
})

app.get('/api/readfilewa',jwtAuth, (req, res) => {
  const file = readFileWa('./text.txt');
  res.send("succes read file");
})

async function readFile(fileName) {
  try{
    console.log('Membaca file... (await)');
    const data = await fs.readFile(fileName, 'utf8');
    console.log(data.toString());
    console.log('Selesai membaca file')
    return data;
  }catch (err){
    console.log(err.message);
  }
}

function readFileWa(fileName) {
  console.log('Membaca file... (without await)');
  const data = fs.readFile(fileName, 'utf8')
    .then(result => {
        console.log(result.toString());
    })
    .catch(err => console.log(err.message))
    .finally(() => console.log('Selesai membaca file'));
  return data;
}

// const test = readFileWa('./text.txt');
// console.log(test);

// var events = require('events');
// var eventEmitter = new events.EventEmitter();
// eventEmitter.on('read file', readFileWa);
// eventEmitter.emit('read file', './text.txt');

app.get('/api/readdata', (req, res) => {
  const data = readdata();
  res.send(data);
})

const listOfBooks = [
  {
  name : 'Harry Potter',
  price : 1000,
  },
  {
  name : 'Lord of the Ring',
  price : 2000,
  },
  {
  name : 'The Hobbit',
  price : 3000,
  }
]

function readdata (){
  // using set
  let set = new Set();
  let setData = [];
  for (let i = 0; i < listOfBooks.length; i++) {
    set.add(listOfBooks[i]);
  }
  for (let user of set) {
    setData.push(user);
  }
  console.log("using set");
  console.log(set);
  console.log(setData);

  //using map
  let map = new Map();
  let mapData = [];
  for (let i = 0; i < listOfBooks.length; i++) {
    map.set(listOfBooks[i].name, listOfBooks[i].price);
  }
  for (let [key, value] of map) {
    mapData.push({name : key, price : value});
  }
  console.log("using map");
  console.log(map);
  console.log(mapData);

  let returnData = {"using set" : setData, "using map" : mapData};
  return returnData;
}

app.listen(port)