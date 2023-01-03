//Hoang Quan TRAN - 20249088
//Simon Thivierge - 20248484
//Octavian Mocanu - 20157889

var cartList = []; 

$(document).ready(function(){
    var items = {...localStorage}; 
    for (product of Object.values(items)){
        objProduct = JSON.parse(product); 
        if (objProduct.hasOwnProperty("id"))
            cartList.push(objProduct); 
    }
    sortProducts(cartList, "name", false); 

    if (cartList.length == 0){
        showEmptyCart();
    } 
    else{
        displayProducts(cartList);
        calculatePriceTotal(cartList);
        disableDecrement(); 
    }
});

//Decrement button
$(document).ready(function(){
    $('.remove-quantity-button').click(function(){ 
        let id = getId(this);

        //make change to locaLStorage
        let adjustedItem = adjustQuantityItem(id, "remove")
        let priceItem = (adjustedItem.quantity * adjustedItem.price).toFixed(2).toString() + '&thinsp;$';

        //make change to html element 
        $(".quantity." + id).html(adjustedItem.quantity);
        $(".priceItem." + id).html(priceItem);

        //disable decrement button if quantity = 1
        if (adjustedItem.quantity == 1){
            $(this).prop("disabled", true);
        }
        else if (adjustedItem.quantity > 1){
            $(this).prop("disabled", false);
        }

        //update priceTotal
        calculatePriceTotal(getItemsFromLocalStorage()); 

        // Update the header item count
        updateShoppingListCount();
    }); 
})

//Increment button
$(document).ready(function(){
    $('.add-quantity-button').click(function(){
        let id = getId(this);

        //make change to localStorage
        let adjustedItem = adjustQuantityItem(id, "add"); 
        let priceItem = (adjustedItem.quantity * adjustedItem.price).toFixed(2).toString() + '&thinsp;$';
        
        //make change to html element
        $(".quantity." + id).html(adjustedItem.quantity);
        $(".priceItem." + id).html(priceItem);

        //enable decrement button bcz quantity go up
        if (adjustedItem.quantity > 1){
            $(".remove-quantity-button."+id).prop("disabled", false);
        }

        //update priceTotal
        calculatePriceTotal(getItemsFromLocalStorage()); 
        // Update the header item count
        updateShoppingListCount();
    }); 
})

//Remove item button
$(document).ready(function(){
    $(".remove-all-button").click(function(){
        answer = confirmationBox("Voulez-vous supprimer tous les produits du panier?");
        if (answer){
            //remove html element
            $(this).parents("tr").remove(); 

            //remove localStorage
            let itemId = "Item #" + $(this).parents("tr").attr('id');
            localStorage.removeItem(itemId);

            //show cart or empty page if cart is empty
            displayShoppingCart(); 
            // Update header item count
            updateShoppingListCount(); 
        }
    })
})

//Empty cart button
$(document).ready(function(){
    $("#remove-all-items-button").click(function(){
        let answer = confirmationBox("Voulez-vous supprimer ce produit du panier?"); 
        if (answer){
            //save list of orders bcz we want to clear items
            saveOrdersInLocalStorage();
            //show cart
            displayShoppingCart();
            // Update header item count
            updateShoppingListCount(); 
        }
    })
})


//_____Display methods________
function displayProduct(obj){
    //using a object type product to return a string, and NOT output anything
    let id = obj.id.toString(); 
    let name = obj.name.toString();
    let price = obj.price.toString();
    let quantity = obj.quantity.toString(); 

    let priceTotal = Number(price) * Number(quantity); 
    let shoppingCartLine = ""; 

    shoppingCartLine +='<tr id="'+ id +'">'; 
    shoppingCartLine +='<td><button title="Supprimer" class="remove-all-button '+ id + '"><i class="fa fa-times"></i></button></td>'; 
    shoppingCartLine +='<td><a href="./product.html?id='+id+'">' + name +'</a></td>';
    shoppingCartLine +='<td>' + price + '&thinsp;$</td>';
    shoppingCartLine +='<td>';
    shoppingCartLine +='<div class="row">';
    shoppingCartLine +='<div class="col">';
    shoppingCartLine +='<button class="remove-quantity-button '+ id +'" title="Retirer"><i class="fa fa-minus"></i></button>';
    shoppingCartLine +='</div>';
    shoppingCartLine +='<div class="quantity ' + id +'">'+ quantity +'</div>';
    shoppingCartLine +='<div class="col">';
    shoppingCartLine +='<button class="add-quantity-button '+ id +'" title="Ajouter"><i class="fa fa-plus"></i></button>';
    shoppingCartLine +='</div>';
    shoppingCartLine +='</div>';
    shoppingCartLine +='</td>'; 

    shoppingCartLine +='<td class="priceItem '+ id +'">'+ priceTotal.toString() +'&thinsp;$</td>'; 
    shoppingCartLine +='</tr>';

    return shoppingCartLine;
}

function displayProducts(list){
    let html; 
    for (let item of list)
        html += displayProduct(item)
    $("tbody").html(html);
}

function displayShoppingCart(){
    cartList = getItemsFromLocalStorage(); 
    sortProducts(cartList, "name", false); 
    if (cartList.length == 0){
        showEmptyCart();
    } 
    else{
        displayProducts(cartList);
        calculatePriceTotal(cartList);
    }
}


//_________Methods that change html element__________
function calculatePriceTotal(list){
    let priceTotal = 0;
    for (let item of list){
        priceTotal += Number(item.price) * Number(item.quantity);
    }
    $(".shopping-cart-total > strong").html(priceTotal.toFixed(2).toString()+'&thinsp;$')
}

function showEmptyCart(){
    emptyPage = "<h1>Panier</h1>" + "<p>Aucun produit dans le panier</p>";
    $("article").html(emptyPage);
}

function confirmationBox(message){
    let answer = window.confirm(message); 
    return answer; 
}

function disableDecrement(){
    $(".quantity").each(function(){
        if ($(this).html() == 1){
            let id = getId(this); 
            $(".remove-quantity-button."+id).prop("disabled", true);
        }
    })
}

//_______Local Storage Methods__________
function getItemsFromLocalStorage(){
    let items = {...localStorage}; 
    let products = []; 

    for (product of Object.values(items)){
        objProduct = JSON.parse(product); 
        if (objProduct.hasOwnProperty("id"))
            products.push(objProduct); 
    }
    return products;
}

function saveOrdersInLocalStorage(){
    let items = {...localStorage}; 
    let orders = [];
    for (product of Object.values(items)){
        let obj = JSON.parse(product); 
        if (obj.hasOwnProperty("firstName"))
            orders.push(obj);
    }
    //clear localStorage
    localStorage.clear(); 

    // rewrite to localStorage order List
    for (let order of orders){
        let orderId = "Order #" + order.orderNumber;
        localStorage.setItem(orderId, JSON.stringify(order));
    }
}

function adjustQuantityItem(id, fn){
    let idLocalStorage = "Item #" + id.toString();
    let item = localStorage.getItem(idLocalStorage); 
    item = JSON.parse(item); 
    if (fn == "add")
        item.quantity += 1; 
    else
        item.quantity -= 1; 
    localStorage.setItem(idLocalStorage, JSON.stringify(item)); 
    return item; 
}

//________Utility Methods___________
function getClasses(className){
    // Get class list string
    var classList = $(className).attr("class");
    return classList.split(/\s+/);
}

function getId(selector){
    let classes = getClasses(selector); 
    let id = classes[1].toString();
    return id; 
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