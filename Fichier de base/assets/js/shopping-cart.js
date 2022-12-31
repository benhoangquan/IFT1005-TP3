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
    }
});

$(document).ready(function(){
    $('.remove-quantity-button').click(function(){
        let classes = getClasses(this); 
        let id = classes[1].toString();

        let adjustedItem = adjustQuantityItem(id, "remove")
        $(".quantity" + id).html(adjustedItem.quantity);

        let priceItem = (adjustedItem.quantity * adjustedItem.price).toFixed(2).toString() + '&thinsp;$';
        $(".priceItem" + id).html(priceItem);

        if (adjustedItem.quantity == 1){
            $(".remove-quantity-button").prop("disabled", true);
        }
        else if (adjustedItem.quantity > 1){
            $(".remove-quantity-button").prop("disabled", false);
        }

        calculatePriceTotal(getItemsFromLocalStorage()); 

    }); 
})

$(document).ready(function(){
    $('.add-quantity-button').click(function(){
        let classes = getClasses(this); 
        let id = classes[1].toString();

        let adjustedItem = adjustQuantityItem(id, "add"); 
        $(".quantity" + id).html(adjustedItem.quantity);

        let priceItem = (adjustedItem.quantity * adjustedItem.price).toFixed(2).toString() + '&thinsp;$';
        $(".priceItem" + id).html(priceItem);

        if (adjustedItem.quantity > 1){
            $(".remove-quantity-button").prop("disabled", false);
        }

        calculatePriceTotal(getItemsFromLocalStorage()); 
    }); 
})

$(document).ready(function(){
    //remove html element
    $(".remove-all-button").click(function(){
        answer = confirmationBox("Voulez-vous supprimer tous les produits du panier?");
        if (answer){
            $(this).parents("tr").remove(); 
            let itemId = "Item #" + $(this).parents("tr").attr('id');
            localStorage.removeItem(itemId);
            cartList = getItemsFromLocalStorage()
            if (cartList.length == 0)
                showEmptyCart(); 
        }
    })
})

$(document).ready(function(){
    $("#remove-all-items-button").click(function(){
        let answer = confirmationBox("Voulez-vous supprimer ce produit du panier?"); 
        //save list of orders bcz we want to clear items
        if (answer){
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
    
            //redisplay the list
            displayShoppingCart(); 
        }

    })
})


function displayShoppingCart(){
    cartList = getItemsFromLocalStorage(); 
    sortProducts(cartList, "name", false); 
    if (cartList.length == 0){
        showEmptyCart();
    } 
    else{
        displayProducts(cartList);
        // updateShoppingListCount(); 
        calculatePriceTotal(cartList);
    }
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

function displayProduct(obj){
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
    shoppingCartLine +='<div class="quantity' + id +'">'+ quantity +'</div>';
    shoppingCartLine +='<div class="col">';
    shoppingCartLine +='<button class="add-quantity-button '+ id +'" title="Ajouter"><i class="fa fa-plus"></i></button>';
    shoppingCartLine +='</div>';
    shoppingCartLine +='</div>';
    shoppingCartLine +='</td>'; 

    shoppingCartLine +='<td class="priceItem'+ id +'">'+ priceTotal.toString() +'&thinsp;$</td>'; 
    shoppingCartLine +='</tr>';

    return shoppingCartLine;
}

function displayProducts(list){
    let html; 
    for (let item of list)
        html += displayProduct(item)
    $("tbody").html(html);
}

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

function getClasses(className){
    // Get class list string
    var classList = $(className).attr("class");
    return classList.split(/\s+/);
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

function confirmationBox(message){
    let answer = window.confirm(message); 
    return answer; 
}
