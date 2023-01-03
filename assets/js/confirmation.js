//Hoang Quan TRAN - 20249088
//Simon Thivierge - 20248484
//Octavian Mocanu - 20157889

let orderNumber = parseInt(localStorage.getItem('orderNumber'));
$("#confirmation-number > strong").html(String(orderNumber).padStart(5, '0'));
