// *! MODAL /////////////////////////
let modal = document.querySelector(".modal");

//  shows the modal when the user clicks open-btn
$("#cart").click(function () {
  $("#modal-background").css("display", "block");
});

//  hides the modal when the user clicks close-btn
$("#close-btn").click(function () {
  $("#modal-background").css("display", "none");
});

// hides the modal when the user clicks outside the modal
let modalBackground = document.getElementById("modal-background");
$(window).click(function (event) {
  if (event.target === modalBackground) {
    //  hides the modal
    $("#modal-background").css("display", "none");
  }
});

$.getJSON("construction.json", function (data) {
  insertProducts(data);
});

function insertProducts(data) {
  data.map((element) => {
    const productName = element.id;
    const eachProduct = document.createElement("div");
    eachProduct.classList.add("each-product");
    eachProduct.innerHTML = `
    <p>${productName}</p>
    <button data-value="${element.price}" class='add-cart'>addtocart</button>
    `;

    $("#container").append(eachProduct);
  });

  $(".add-cart").click(function (e) {
    addToCart(e);
  });
}

const rupeeIcon = '<i class="fa fa-inr"></i>';

function addToCart(e) {
  const eachModalPrice = e.target.dataset.value;
  const eachProductName = e.target.previousElementSibling.innerHTML;
  const eachModalProduct = document.createElement("div");
  eachModalProduct.classList.add("each-modal-product");
  eachModalProduct.innerHTML = `
  <span class='item-name'>${eachProductName}</span>
  <span class='item-price'>${eachModalPrice}</span>
  <span><input type = 'number' class = 'num' value = '1'></span>
  <span class="total-price">${rupeeIcon}<span>${eachModalPrice}</span></span>
  <span><button class="modal-remove" type="button">Remove</button></span>`;
  $(modal).append(eachModalProduct);

  for (let i = 0; i < $(".num").length; i++) {
    $(".num").value = 1;
    $(".num").change(totalCost);
  }

  for (let i = 0; i < $(".modal-remove").length; i++) {
    $(".modal-remove").click(removeItem);
  }

  grandTotal();
}

// This function helps to multiply the quantity and the price
function totalCost(event) {
  let quantity = event.target;
  quantity_parent = quantity.parentElement.parentElement;
  price_field = quantity_parent.getElementsByClassName("item-price")[0];
  total_field = quantity_parent.getElementsByClassName("total-price")[0];
  price_field_content = price_field.innerText;

  total_field.innerHTML = rupeeIcon + quantity.value * price_field_content;

  grandTotal();

  if (isNaN(quantity.value) || quantity.value <= 0) {
    quantity.value = 0;
  }
}

// This function helps to add up the total of the items
function grandTotal() {
  let total = 0;
  let grand_total = document.querySelector(".grand-total");

  all_total_fields = document.getElementsByClassName("total-price");

  for (let i = 0; i < all_total_fields.length; i++) {
    all_prices = Number(all_total_fields[i].innerText);
    total += all_prices;
  }

  grand_total.innerHTML = rupeeIcon + total;
  grand_total.style.fontWeight = "bold";
}

function removeItem(event) {
  del_btn = event.target;
  del_btn_parent = del_btn.parentElement.parentElement;
  del_btn_parent.remove();
  grandTotal();
  // let decrementNum = --cartNum;
  // cart.innerHTML = decrementNum;
}
