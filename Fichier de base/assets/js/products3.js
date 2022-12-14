var productList = []; 
var toDisplayList = []; 

function loadDoc() {
    var productList = []; 
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

function defaultSortAndFilter(){
    var toDisplayList = productList; 
    sortProducts(toDisplayList, "price", false);
    displayList(toDisplayList); 

    $(".filter-btn:contains('Tous les produits')").toggleClass("selected");
    $(".sort-btn:contains('Prix (bas-haut)')").toggleClass("selected");
}

$(document).ready(function() {
    loadDoc(); 
});

$(document).ready(function() {
    $(".sort-btn").click(function(){
        if (toDisplayList.length == 0){
            toDisplayList = productList; 
        }
        if (this.innerHTML.includes("Nom")){
            if(this.innerHTML.includes("A-Z"))
                sortProducts(toDisplayList, "name", false);
            else {sortProducts(toDisplayList, "name", true);}
        } else {
            if(this.innerHTML.includes("bas-haut"))
                sortProducts(toDisplayList, "price", false);
            else {sortProducts(toDisplayList, "price", true);}
        }
        displayList(toDisplayList);

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