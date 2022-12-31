$(document).ready(function(){
    updateShoppingListCount();
});

function updateShoppingListCount(){
    var items = {...localStorage}; 
    nbProduct = 0; 
    for (product of Object.values(items)){
        product = JSON.parse(product);
        if (product.quantity > 0)
            nbProduct += parseInt(product.quantity);   
    }
    $(".count").html(nbProduct);

    if (nbProduct==0)
        $('.count').hide();
    else
        $('.count').show();
}