document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  const payNowButton = document.getElementById("pay-now-button");
  nextButton.addEventListener("click", handleNextButtonClick);
  backButton.addEventListener("click", handleBackButtonClick);
  payNowButton.addEventListener("click", handlePayNowButtonClick);

  const productCheckboxes = document.querySelectorAll('.product-showcase input[type="checkbox"]');
  productCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateTotalAmount);
  });
  updateTotalAmount();
});

function updateTotalAmount() {
  const selectedProducts = document.querySelectorAll('.product-showcase input[type="checkbox"]:checked');
  let totalAmount = 0;
  selectedProducts.forEach((product) => {
    totalAmount += Number(product.value);
  });

  document.getElementById("totalValue").textContent = "AUD $" + totalAmount;
  document.getElementById("registrationTotal").textContent = "AUD $" + totalAmount;
  document.getElementById("amountPayable").textContent = "AUD $" + totalAmount;
}

function handleNextButtonClick() {
  const form = document.getElementById("registration-form");
  const selectedProducts = document.querySelectorAll('.product-showcase input[type="checkbox"]:checked');
  if (form.checkValidity() && selectedProducts.length > 0) {
    form.style.display = "none";
    document.getElementById("confirmation-section").style.display = "block";
  } else {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product from the list.");
    } else {
      form.reportValidity();
    }
  }
}

function handleBackButtonClick() {
  document.getElementById("confirmation-section").style.display = "none";
  document.getElementById("registration-form").style.display = "block";
}

async function handlePayNowButtonClick() {
  console.log("Pay Now button clicked");
  const scriptsToLoad = [
    "https://payuat.travelpay.com.au/Content/bootstrap.min.css",
    "https://payuat.travelpay.com.au/Content/font-awesome.min.css",
    "https://payuat.travelpay.com.au/assets/css/ace-fonts.css",
    "https://payuat.travelpay.com.au/assets/css/ace.min.css",
    "https://payuat.travelpay.com.au/assets/css/ace-skins.min.css",
    "https://payuat.travelpay.com.au/assets/css/ace-rtl.min.css",
    "https://payuat.travelpay.com.au/Libraries/sweetalert/css/sweetalert2.css",
    "https://payuat.travelpay.com.au/Content/awesome-bootstrap-checkbox.css",
    "https://payuat.travelpay.com.au/Content/style-overrides.css",
    "https://payuat.travelpay.com.au/Scripts/jquery-3.7.0.min.js",
    "https://payuat.travelpay.com.au/Scripts/jquery.validate.js",
    "https://payuat.travelpay.com.au/Scripts/jquery.validate.unobtrusive.min.js",
    "https://payuat.travelpay.com.au/Scripts/jquery.payment.js",
    "https://payuat.travelpay.com.au/Scripts/jquery.unobtrusive-ajax.min.js",
    "https://payuat.travelpay.com.au/assets/js/ace-extra.min.js",
    "https://payuat.travelpay.com.au/Scripts/bootstrap.min.js",
    "https://payuat.travelpay.com.au/assets/js/ace-elements.min.js",
    "https://payuat.travelpay.com.au/assets/js/ace/ace.js",
    "https://payuat.travelpay.com.au/node_modules/autonumeric/dist/autoNumeric.min.js",
    "https://payuat.travelpay.com.au/Scripts/bluebird-3.3.4.min.js",
    "https://payuat.travelpay.com.au/Libraries/sweetalert/js/sweetalert2.js",
    "https://payuat.travelpay.com.au/Scripts/ZenPay/zenpay.infoicon.js?v=1.101.0.12842",
    "https://payuat.travelpay.com.au/Scripts/jquery.mask.min.js",
    "https://payuat.travelpay.com.au/Scripts/jquery.blockUI.js",
    "https://payuat.travelpay.com.au/Scripts/timer.jquery.js",
    "https://payuat.travelpay.com.au/Scripts/ZenPay/zenpay.scaerrorcode.handler.js?v=1.101.0.12842",
    "https://payuat.travelpay.com.au/Scripts/ZenPay/zenpay.cybersource.stepup.js?v=1.101.0.12842",
  ];
  // Dynamically create and append scripts
  for (let scriptSrc of scriptsToLoad) {
    let scriptElement = document.createElement("script");
    scriptElement.src = scriptSrc;

    // Append to the body
    document.body.appendChild(scriptElement);
  }

  const formData = {
    title: document.getElementById("title").value,
    mobile: document.getElementById("mobile").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("emailInput").value,
    companyName: document.getElementById("companyName").value,
  };
  const selectedProducts = document.querySelectorAll('.product-showcase input[type="checkbox"]:checked');
  let totalAmount = 0;
  selectedProducts.forEach((product) => {
    totalAmount += Number(product.value);
  });
  const paymentData = {
    ...formData,
    wholeNumberAmount: totalAmount,
  };
  console.log("Initiating payment with data:", paymentData);
  try {
    let response = await fetch("/initiate-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    if (response.headers.get("Content-Type").includes("application/json")) {
      // Handle JSON response
      let jsonResponse = await response.json();
      console.log(jsonResponse);
    } else if (response.headers.get("Content-Type").includes("text/html")) {
      // Handle HTML response
      let htmlResponse = await response.text();
      document.open();
      document.write(htmlResponse);
      document.close();
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
  }
}

// async function handlePayNowButtonClick() {
//   console.log("Pay Now button clicked with data:", formData);
//   const formData = {
//     title: document.getElementById("title").value,
//     mobile: document.getElementById("mobile").value,
//     firstName: document.getElementById("firstName").value,
//     lastName: document.getElementById("lastName").value,
//     email: document.getElementById("emailInput").value,
//     companyName: document.getElementById("companyName").value,
//   };
//   // Calculate the total amount based on selected products
//   const selectedProducts = document.querySelectorAll('.product-showcase input[type="checkbox"]:checked');
//   let totalAmount = 0;
//   selectedProducts.forEach((product) => {
//     totalAmount += Number(product.value);
//   });
//   const paymentData = {
//     ...formData,
//     wholeNumberAmount: totalAmount,
//   };
//   try {
//     const response = await fetch("/initiate-payment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(paymentData),
//     });
//     const data = await response.json();
//     console.log("Response from /initiate-payment:", data);
//     window.location.href = data.redirectUrl;
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//   }
// }
