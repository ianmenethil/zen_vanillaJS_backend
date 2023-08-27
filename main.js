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
  } else if (selectedProducts.length === 0) {
    alert("Please select at least one product from the list.");
  } else {
    form.reportValidity();
  }
}

function handleBackButtonClick() {
  document.getElementById("confirmation-section").style.display = "none";
  document.getElementById("registration-form").style.display = "block";
}

async function handlePayNowButtonClick() {
  console.log("Pay Now button clicked");
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
  const paymentData = { ...formData, wholeNumberAmount: totalAmount };
  console.log("Initiating payment with data:", paymentData);
  try {
    let response = await fetch("/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    if (response.ok) {
      let jsonResponse = await response.json();
      window.location.href = jsonResponse.redirectUrl;
    } else {
      console.error("Server responded with status:", response.status);
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
  }
}
