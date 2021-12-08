// *! MODAL /////////////////////////
let modal = document.querySelector(".modal");

$("#cart").click(function () {
  $("#modal-background").css("display", "block");
});

$("#close-btn").click(function () {
  $("#modal-background").css("display", "none");
});

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
    <p class='product-name'>${productName}</p>
    <button data-value="${element.price}" class='add-cart'>addtocart</button>
    <img class='img' src='${element.image}' >
    `;

    $("#container").append(eachProduct);
  });

  $(".add-cart").click(function (e) {
    addToCart(e);
  });
}

const rupeeIcon = '<i class="fa fa-inr"></i>';
let arr = [];

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

  arr.push(eachProductName);
  console.log(arr);

  if (checkIfArrayIsUnique(arr) == false) {
    alert(`${eachProductName} is already in cart`);
    arr.pop();
    modal.lastElementChild.remove();
    return;
  }

  for (let i = 0; i < $(".num").length; i++) {
    $(".num").value = 1;
    $(".num").change(totalCost);
  }

  for (let i = 0; i < $(".modal-remove").length; i++) {
    $(".modal-remove").click(removeItem);
  }

  grandTotal();
}

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
  console.dir(
    event.target.parentElement.parentElement.firstElementChild.innerHTML
  );
  del_btn_parent.remove();
  grandTotal();

  for (var i = 0; i < arr.length; i++) {
    if (
      arr[i] ===
      `${event.target.parentElement.parentElement.firstElementChild.innerHTML}`
    ) {
      arr.splice(i, 1);
    }
  }
}

function checkIfArrayIsUnique(myArray) {
  return myArray.length === new Set(myArray).size;
}

// *! ////////////////////////////////////////////////////

var myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Basic cnpwX3Rlc3RfVnVKVG9MZUVwdElBOTE6SXB2S1RWZWpQUzB1V3BvdHdOS3dBVm1G"
);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  amount: 10000,
  currency: "INR",
  receipt: "rcptid_11",
});

var requestOptions = {
  method: "POST",
  mode: "no-cors",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("https://api.razorpay.com/v1/orders", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

var options = {
  key: "rzp_test_VuJToLeEptIA91", // Enter the Key ID generated from the Dashboard
  amount: "50", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: "INR",
  name: "Construction Materials",
  description: "Bill",
  image:
    "https://thumbs.dreamstime.com/b/vector-logo-building-materials-store-company-201109487.jpg",
  order_id: "order_IUqGHuugQGHrhl", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  handler: function (response) {
    alert(response.razorpay_payment_id);
    alert(response.razorpay_order_id);
    alert(response.razorpay_signature);
  },
  prefill: {
    name: "Abilash",
    email: "abimugunthan2000@gmail.com",
    contact: "9943167123",
  },
  notes: {
    address: "Razorpay Corporate Office",
  },
  theme: {
    color: "#8D908F",
  },
};

var rzp1 = new Razorpay(options);
rzp1.on("payment.failed", function (response) {
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
});
document.getElementById("rzp-button1").onclick = function (e) {
  rzp1.open();
  e.preventDefault();
};
