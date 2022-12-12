var productList = []; 

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

function range(start, end) {
    return Array.apply(0, Array(end - 1))
      .map((element, index) => index + start);
}

function displayInfoProducts(id){
    index = id - 1; 
    if (index in range(0, productList.length)){
        $("#product-image").attr("src", "./assets/img/" + productList[index].image);

        $("#product-name").html(productList[index].name);
        $("#product-desc").html(productList[index].description);
    
        var featureList = ""; 
        for (let i = 0; i < productList[index].features.length; i++)
            featureList += "<li>" + productList[index].features[i] + "</li>"; 
        $("#product-features").html(featureList);
    
        $("#product-price").html('Prix: <strong>'+ productList[index].price +'&thinsp;$</strong>');
    }
    else{
        $('article').html('<h1>Page non trouvée!</h1>'); 
    }
}

$(document).ready(function () {
    $.ajax({
        async: true, 
        type: "GET",
        url: "./data/products.json",
        datatype: 'json',
        success: function(xhr){
            productList = xhr; 
            displayInfoProducts($.urlParam('id')); 
        }
    }); 
});

// console.log($.urlParam('id'));