//Hoang Quan TRAN - 20249088
//Simon Thivierge - 20248484
//Octavian Mocanu - 20157889

// Custom jquery form validate rule for the credit card expiry date
jQuery.validator.addMethod("validexpiry", function(value, element) {
    return this.optional(element) || /^((0[1-9])|(1[0-2]))\/(\d{2})$/.test(value);
  }, "La date d’expiration de votre carte de crédit est invalide.");
  
// The validation rules for the form
$(function() {
    // Initialize form validation on the order form.
    // It has the name attribute "orderForm"
    $( "#orderForm" ).validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are on the right side
            firstname: {
                required: true,
                minlength: 2
            },
            lastname: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true,
                phoneUS: true
            },
            creditcard: {
                required: true,
                creditcard: true
            },
            creditcardexpiry: {
                required: true,
                validexpiry: true
            },
        },    
        });
    
});

// Code section to remove the cart in the local storage and also keep the first and last name and
// the order number in the local storage
$(function() {
    let orderNumber;  // the order Number

    // Check if the order number is saved in local storage
    if (localStorage.getItem('orderNumber')) {
      // If it is, retrieve the value from local storage
        orderNumber = parseInt(localStorage.getItem('orderNumber'));  // Convert the value to a number
    } 
    else {
      // If it is not, initialize the order number to 0
        localStorage.setItem('orderNumber', 0)
    }
    

    $('#orderForm').on('submit', function(form) {
        if (!$(this).valid()) {
            return false;
          };
        // Prevent the form from being submitted
        form.preventDefault();
          
         // Remove the shopping cart from local storage and all past order stayed
        let orderNumber = parseInt(localStorage.getItem('orderNumber')) + 1;
        saveOrdersInLocalStorage(); 

        // Get the first name and last name from the form
        const firstName = $('#first-name').val();
        const lastName = $('#last-name').val();

        let orderInfo = new Object(); 
        orderInfo["firstName"] = firstName;
        orderInfo["lastName"] = lastName; 
        orderInfo["orderNumber"] = orderNumber;

        // Save the first name, last name, and order number to local storage
        orderId = "Order #" + orderNumber; 
        localStorage.setItem(orderId, JSON.stringify(orderInfo));
  
        // Save order quantity to localStorage
        localStorage.setItem("orderNumber", orderNumber);
        
        // Redirect to the confirmation page
        window.location.href = './confirmation.html';
    });    
  });