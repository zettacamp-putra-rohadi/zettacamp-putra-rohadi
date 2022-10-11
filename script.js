const price = 1200;
const discount = 10;
const tax = 5;

function book(price,discount,tax) {
    const nameBook = "The Sea Speak His Name";
    const totalDiscount = (price * discount) / 100;
    const totalTax = ((price - totalDiscount) * tax) / 100;
    const detailBook = {
        name : nameBook,
        price : price,
        discount : totalDiscount,
        priceAfterDiscount : price - totalDiscount,
        tax : totalTax,
        total : price - totalDiscount + totalTax,
    };
    return detailBook;
}

const detail = book(price,discount,tax);

let listDetail = "Name : " + detail.name; 
listDetail += "\nDiscount : " + detail.discount;
listDetail += "\nPrice After Discount : " + detail.priceAfterDiscount; 
listDetail += "\nTax : " + detail.tax;
listDetail += "\nTotal Price : " + detail.total;
const a = Boolean(1<3);

console.log(listDetail, a);