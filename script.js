const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");

const app = express()
const port = 3000

app.use(bodyParser.json());

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
readdata();
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