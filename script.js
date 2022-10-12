function book(bookName, discount, tax, bookstock, bookpurchase) {
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
      \nYou Bought = ${i} books
      \nTotal Price = ${totalPrice}`;
    } else {
      totalPrice += price;
      bookstock--;
    }
  }
  return `Total Price = ${totalPrice}
      \nLeft in stock = ${bookstock}`;
};

const detail = book("And",10,5,2,3);
console.log(detail);
