var productList = []; 
var displayedList = []; 

function loadDoc2() {
    var productList = []; 
    $.ajax({
        async: true, 
        type: "GET",
        url: "./data/products.json",
        datatype: 'json',
        success: function(xhr){
            displayList(xhr); 
            updateProductList(xhr); 
        }
    }); 
}

function updateProductList(list){
    productList = list; 
}

function displayList(array) {
    var productCell = ""; 
    var table = ""; 
    
    for(let i = 0; i < array.length; i++){
        productCell += '<div class="product"' + ' class="' + array[i].category + '">';
        productCell += '<a href="./product.html?id='+ array[i].id +'" title="En savoir plus...">';
        productCell += '<h2>' + 
            array[i].name + '</h2>';
        productCell += '<img alt="' + array[i].name + 
            '" src="./assets/img/' + array[i].image + '">';
        productCell += '<p class="price"><small>Prix</small>' + " " +
            array[i].price + '&thinsp;$</p>'; 
        productCell += '</a>';
        productCell += '</div>';
        
        table += productCell; 
        productCell = "";
    }
    $("#products-list").html(table); 

}

function sortProducts(list, criteria, descending){
    switch(criteria){
        case "name": 
            list.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1);
            break;
        case "price":
            list.sort((a,b) => (a.price > b.price) ? 1 : -1);
            break; 
    }
    if (descending){
        list.reverse(); 
    }
}

function filterProducts(list, category){
    var filteredList = []; 
    for(let i = 0; i < list.length; i++){
        if (list[i].category == category) {
            filteredList.push(list[i]);
        }
    }
    return filteredList; 
}

$(document).ready(function() {
    loadDoc2(); 
});

$(document).ready(function() {
    $(".sort-btn").click(function(){
        if (displayedList.length == 0){
            displayedList = productList; 
        }
        if (this.innerHTML.includes("Nom")){
            if(this.innerHTML.includes("A-Z"))
                sortProducts(displayedList, "name", false);
            else {sortProducts(displayedList, "name", true);}
        } else {
            if(this.innerHTML.includes("bas-haut"))
                sortProducts(displayedList, "price", false);
            else {sortProducts(displayedList, "price", true);}
        }
        displayList(displayedList);

        $(".selected.sort-btn").toggleClass("selected"); 
        $(this).toggleClass("selected");
    });
});

$(document).ready(function() {
    $(".filter-btn").click(function(){
        var filterCategory = "";
        switch(this.innerHTML){
            case "Appareils photo": filterCategory = "cameras"; break; 
            case "Consoles": filterCategory = "consoles"; break;
            case "Écrans": filterCategory = "screens"; break; 
            case "Ordinateurs": filterCategory = "computers"; break; 
            default: filterCategory = new RegExp(".*?"); //bug here
        }
        displayedList = filterProducts(productList, filterCategory); 
        displayList(displayedList);

        // update product count
        $('#products-count').html(displayedList.length + " produit" + (displayedList.length ? "s" : "")); 

        // update selected button
        $(".selected.filter-btn").toggleClass("selected"); 
        $(this).toggleClass("selected");
    })
    
}); 



