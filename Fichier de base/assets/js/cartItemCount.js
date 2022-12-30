// Pour changer le chiffre sur le panier d'achat du nav avec le nombre d'item dans 
// shopping cart.



//calcul le nombre ditems dans le panier. additionne le nombre de chaque type ditem
//let nbItemsCart = () => {
//    console.log("nbItemsCart function is running") 
//    let cartIcon = document.getElementById("count");
//    cartIcon.innerHTML = panier.map((x) => x.quantity).reduce((x,y) => x+y, 0)
    
//}

//nbItemsCart();

function calculateTotalQuantity() {
    let totalQuantity = 0;
  
    // Loop through all keys in local storage
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key);
  
      // Check if the value is an object with a "quantity" field
      if (typeof value === "string" && value.includes("quantity")) {
        // Parse the value as a JSON object and add the quantity to the total
        let item = JSON.parse(value);
        totalQuantity += item.quantity;
      }
    }
  
    return totalQuantity;
  }
  //This function loops through all keys in local storage, and for each key that has a value that is a string containing the word "quantity", it parses the value as a JSON object and adds the value of the "quantity" field to the total quantity.
  
  //You can use this function by calling calculateTotalQuantity(). For example:
  let cartCount = document.getElementById("count");
  let totalQuantity = calculateTotalQuantity();
  console.log(`Total quantity: ${totalQuantity}`);
  cartCount.textContent = totalQuantity;
 // I hope this helps! Let me know if you have any questions or if you'd like further clarification.
  
  
  
  
  