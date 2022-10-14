const bodyParser = require('body-parser');
const express = require('express')
const jwt = require("jsonwebtoken");

const app = express()
const port = 3000

app.use(bodyParser.json());

function generateAccessToken(payload) {
  return jwt.sign(payload, 'secret', { expiresIn: '1800s' });
}

app.post('/api/maketoken', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const token = generateAccessToken({ username: username, password: password });

  res.send(token);
})

function jwtAuth(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth.split(' ')[1];

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403)
    console.log("antum user asli");
    next()
  })
}

app.get('/api/buybook', jwtAuth, (req, res) => {
  const books = req.body;
  const bookInformation = [
    books.bookName,
    books.discount,
    books.tax,
    books.bookStock,
    books.bookPurchase,
    books.terms]
  const transaction = book(...bookInformation);
  res.send(transaction)
})

function book(bookName, discount, tax, bookstock, bookpurchase, terms) {
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
  const convTotalPrice = [totalPrice];
  const totalPrice2 = convTotalPrice.map(x => x / terms)
  termEachMonth = totalPrice2[0];
  let creditPay = 0;
  let credit = [];
  for (let i = 0; i < terms; i++) {
    credit.push( 
      {
      'Book Name' : bookName,
      Month : i+1,
      'Credit To Be Paid' : termEachMonth,
      'Credit Already Paid' : creditPay =+ termEachMonth,
      Remaining : totalPrice -= termEachMonth,
      }
      );
    }

  return credit;
};


app.listen(port)