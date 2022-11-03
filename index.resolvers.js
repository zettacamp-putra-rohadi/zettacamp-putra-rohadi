const bookModel = require('./model');

module.exports = {
    Query: {
        getBooks: async () => await bookModel.find({}),
        getOneBook: async (_, { _id }) => await bookModel.findById(_id),
        getBooksPerPage: async (_, { page, limit, sort }) => {
            const getpage = limit * page;
            const book = await bookModel.aggregate([
                    { $sort: { _id: sort } },
                    {
                        $facet : {
                            "book" : [
                            {$skip : getpage},
                            {$limit : limit}
                            ],
                            "totalBook" : [
                            {
                                $group : {
                                _id : null,
                                total : {$sum : 1}
                                }
                            }
                            ]
                        }
                    }
            ]);
            return book;
        }
    },
    Mutation: {
        createBook: async (_, args) => {
            const {
                name,
                author,
                date_published,
                price
            } = args;
            const newDate = new Date(date_published);
            const book = new bookModel({
                name : name,
                author : author,
                date_published : newDate,
                price : price
            });
            const result = await book.save();
            return result;
        },
        updateBook: async (_, args) => {
            const book = await bookModel.findByIdAndUpdate(args._id, args, { new: true });
            return book;
        },
        deleteBook: async (_, args) => {
            const book = await bookModel.findByIdAndRemove(args._id);
            // if (book) 
            return book;
            // return false;
        },
        calcualteBookPurchasing: async (_, args) => {
            const result = await book(args.bookName, args.discount, args.tax, args.bookStock, args.bookPurchase, args.terms, args.addtionalTems);
            // console.log(result);
            return result;
        }
    }
};


// function for book puchasing
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
          Book_Name : bookName,
          Month : i+1,
          Credit_To_Be_Paid : newTermEachMonth,
          Credit_Already_Paid : creditPay = creditPay + newTermEachMonth,
          Remaining : totalPrice -= termEachMonth,
          }
        );
      } else {
        credit.push( 
          {
          Book_Name : bookName,
          Month : i+1,
          Credit_To_Be_Paid : termEachMonth,
          Credit_Already_Paid : creditPay = creditPay + termEachMonth,
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