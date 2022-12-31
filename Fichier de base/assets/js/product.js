var productList = []; 

$(document).ready(function () {
    // to get productList from json file and display current product
    $.ajax({
        async: true, 
        type: "GET",
        url: "./data/products.json",
        datatype: 'json',
        success: function(xhr) {
            //update product list on successful get
            productList = xhr; 

            //product page must have ?id= suffix to identify the product
            if (!window.location.href.includes("?id="))
                window.location.assign("/product.html?id=404"); 

            displayInfoProducts($.urlParam('id')); 
        }
    }); 
});

$(document).ready(function () {
    //to add product and quantity of products to shopping cart after user submission
    //create dialog and fade out after 5s
    var currentUrl = window.location.href; 
    $("#add-to-cart-btn").click(function () {
        var id = $.urlParam('id') - 1; 
        addToLocalStorage(id);
        updateShoppingListCount(); 
        openDialog("Le produit a été ajouté au panier.");
    });
});

$.urlParam = function(name){
    // to get id from url
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

function range(start, end) {
    //utility function to create an Array with element from start to end
    //python equivalent: list(range(start, end))
    return Array.apply(0, Array(end))
      .map((element, index) => index + start);
}

function displayInfoProducts(id){
    // to display data from productList to HTML page
    //id - 1 because first product in json is 1 while it is 0 in productList
    index = id - 1; 
    if (index in range(0, productList.length)){
        //change innerHTML of image, name, price, description, features
        $("#product-image").attr("src", "./assets/img/" + productList[index].image);
        $("#product-name").html(productList[index].name);
        $("#product-desc").html(productList[index].description);
        $("#product-price").html('Prix: <strong>'+ productList[index].price +'&thinsp;$</strong>');
    
        var featureList = ""; 
        for (let i = 0; i < productList[index].features.length; i++)
            featureList += "<li>" + productList[index].features[i] + "</li>"; 
        $("#product-features").html(featureList);
    }
    else{
        $('article').html('<h1>Page non trouvée!</h1>'); 
    }
}

function addToLocalStorage(id) {
    //"virtual shopping cart", to store the data when user add products to cart
    //Bcz local storage store data in key:value pair so 
    //key = item's name
    //value = JSON object contain: price, quantity, and id 
    var keyName = "Item #" + (id+1).toString();
    var currentItem = window.localStorage.getItem(keyName); 

    // create new item if item doesnt exist in local storage
    if (currentItem == null){
        var newItem = new Object(); 
        newItem["id"] = parseInt($.urlParam('id')); 
        newItem["name"] = productList[id].name;
        newItem["quantity"] = parseInt($("#product-quantity").val()); 
        newItem["price"] = parseFloat(productList[id].price); 
        window.localStorage.setItem(keyName, JSON.stringify(newItem));
    }

    // update current item if it exists
    else {
        currentItem = JSON.parse(currentItem);
        currentItem.quantity += parseInt($("#product-quantity").val()); 
        window.localStorage.setItem(keyName, JSON.stringify(currentItem))
    }
}

function openDialog(message){
    //create dialog box
    $("#dialog").remove();
    dialogBox = '<dialog open id ="dialog">' + message + '</dialog>';
    $("article").append(dialogBox); 

    // hide dialog after 5000 ms = 5s and delete to prepare for the next dialog
    $("#dialog").fadeOut(5000,function() {
        $(this).modal('hide');
        $("#dialog").remove();
    });
}