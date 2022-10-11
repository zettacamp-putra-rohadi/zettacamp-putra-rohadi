function book(price, discount, tax, bookstock, bookpurchase) {
  const nameBook = "The Sea Speak His Name";

  if (bookpurchase > bookstock) {
    return "You cannot buy more than in stock";
  } else {
    let priceBook = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    for (i = 1; i <= bookpurchase; i++) {
      priceBook = priceBook + price;
    }
    totalDiscount = (priceBook * discount) / 100;
    totalTax = (priceBook * tax) / 100;
    totalPrice = priceBook - totalDiscount + totalTax;
    left = bookstock - bookpurchase;
    return `Price : ${priceBook} 
    \nTotal Price After Discount : ${priceBook - totalDiscount} 
    \nTotal Tax : ${totalTax}
    \nTotal Price : ${totalPrice}
    \nLeft in stock: ${left}`;
  }
};

const detail = book(1200, 10, 5, 40, 10 );

console.log(detail);
