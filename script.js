function book(bookName, discount, tax, bookstock, bookpurchase, terms) {
  let price = 1000;
  const totalDiscount = (price * discount) / 100;
  const priceAfterDiscount = price - totalDiscount;
  const totalTax = (priceAfterDiscount * tax) / 100;
  price = priceAfterDiscount + totalTax;
  let totalPrice = 0;
  for (let i = 0; i < bookpurchase; i++) {
    totalPrice = totalPrice + price;
    if (bookstock === 0) {
      return `You cannot buy more than in stock. 
      \nStock = ${bookstock}
      \nYou Bought = ${i} books, ${bookpurchase-i} books left.`;
      // \nTotal Price = ${totalPrice}`;
    } else {
      totalPrice += price;
      bookstock--;
    }
  }
  const convTotalPrice = [totalPrice];
  const totalPrice2 = convTotalPrice.map(x => x / terms)
  // const term = (totalPrice) => totalPrice / terms;
  termEachMonth = totalPrice2[0];
  let creditPay = 0;
  let credit = [];
  for (let i = 0; i < terms; i++) {
    credit.push( 
      {
      Month : i+1,
      'Credit To Be Paid' : termEachMonth,
      'Credit Already Paid' : creditPay =+ termEachMonth,
      Remaining : totalPrice -= termEachMonth,
      }
      );
    }
  console.log(credit);
  const {Month} = credit[1];     //destructuring
  console.log("Bulan ke-",Month);
};

const bookInformation = ["The Legend",10,5,4,3,5]       //spread
const detail = book(...bookInformation);

