let orderNumber = parseInt(localStorage.getItem('orderNumber'));
$("#confirmation-number>strong").html(String(orderNumber).padStart(5, '0'));
