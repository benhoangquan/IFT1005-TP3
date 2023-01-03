//Hoang Quan TRAN - 20249088
//Simon Thivierge - 20248484
//Octavian Mocanu - 20157889

var productList = []; 
var toDisplayList = []; 

$(document).ready(function() {
    //ajax call to display list of product, update data to productList
    //and perform a default sort and filter per assignment's request
    $.ajax({
        async: true, 
        type: "GET",
        url: "./data/products.json",
        datatype: 'json',
        success: function(xhr){
            displayList(xhr); 
            updateProductList(xhr); 
            defaultSortAndFilter(); 
        }
    }); 
});

$(document).ready(function() {
    //to sort item after clicking on sort button
    $(".sort-btn").click(function(){
        //assigns the productList and sort after
        toDisplayList = productList; 

        //match button to correct sort function
        //bool value in sortProducts mean is descending or not
        if (this.innerHTML.includes("Nom")){
            if(this.innerHTML.includes("A-Z"))
                sortProducts(toDisplayList, "name", false);
            else {sortProducts(toDisplayList, "name", true);}
        } else {
            if(this.innerHTML.includes("bas-haut"))
                sortProducts(toDisplayList, "price", false);
            else {sortProducts(toDisplayList, "price", true);}
        }
        //display at the end
        displayList(toDisplayList);

        // de-select old button, select clicked button
        $(".selected.sort-btn").toggleClass("selected"); 
        $(this).toggleClass("selected");
    });
});

$(document).ready(function() {
    $(".filter-btn").click(function(){
        var filterCategory = "";

        //match button to actual category in product list
        switch(this.innerHTML){
            case "Appareils photo": filterCategory = "cameras"; break; 
            case "Consoles": filterCategory = "consoles"; break;
            case "Écrans": filterCategory = "screens"; break; 
            case "Ordinateurs": filterCategory = "computers"; break; 
        }

        // display list
        if (this.innerHTML == "Tous les produits")
            toDisplayList = productList; 
        else
            toDisplayList = filterProducts(productList, filterCategory); 
        displayList(toDisplayList);

        // update product count
        $('#products-count').html(toDisplayList.length + " produit" + (toDisplayList.length ? "s" : "")); 

        // de-select old button, select clicked button
        $(".selected.filter-btn").toggleClass("selected"); 
        $(this).toggleClass("selected");
    })
    
}); 

function updateProductList(list){
    productList = list; 
}

function displayList(array) {
    var productCell = ""; 
    var table = ""; 
    
    for(let i = 0; i < array.length; i++){
        //set class of each to its category
        productCell += '<div class="product"' + ' class="' + array[i].category + '">';

        //set its redirection link using its ids
        productCell += '<a href="./product.html?id='+ array[i].id +'" title="En savoir plus...">';

        productCell += '<h2>' + array[i].name + '</h2>';
        productCell += '<img alt="' + array[i].name + '" src="./assets/img/' + array[i].image + '">';
        productCell += '<p class="price"><small>Prix</small>' + " " + array[i].price + '&thinsp;$</p>'; 

        productCell += '</a>';
        productCell += '</div>';
        
        table += productCell; 
        productCell = "";
    }
    //replace current content with updated one
    $("#products-list").html(table); 
}

function sortProducts(list, criteria, descending){
    //sort inputed list with 2 criteria and (criteria descending or ascending)
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
    //return a list of matching category products
    var filteredList = []; 
    for(let i = 0; i < list.length; i++){
        if (list[i].category == category) {
            filteredList.push(list[i]);
        }
    }
    return filteredList; 
}

function defaultSortAndFilter(){
    //default filter all the products and sort with price from high to low
    var toDisplayList = productList; 
    sortProducts(toDisplayList, "price", false);
    displayList(toDisplayList); 

    //change class to gray out current selected button using css
    $(".filter-btn:contains('Tous les produits')").toggleClass("selected");
    $(".sort-btn:contains('Prix (bas-haut)')").toggleClass("selected");
}