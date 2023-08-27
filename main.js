// Code block is executed after the DOM has been fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Getting references to buttons on the page
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  const payNowButton = document.getElementById("pay-now-button");
  // Attaching event listeners to the buttons
  nextButton.addEventListener("click", handleNextButtonClick);
  backButton.addEventListener("click", handleBackButtonClick);
  payNowButton.addEventListener("click", handlePayNowButtonClick);
  // Getting references to all product checkboxes on the page
  const productCheckboxes = document.querySelectorAll('.product-showcase input[type="checkbox"]');
  // Attaching a change event listener to each checkbox to update the total amount whenever a checkbox is checked or unchecked
  productCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateTotalAmount);
  });
  // Updating the total amount initially when the page loads
  updateTotalAmount();
});

// Function to calculate the total amount based on selected products
function calculateTotalAmount() {
  const selectedProducts = document.querySelectorAll('.product-showcase input[type="checkbox"]:checked');
  let totalAmount = 0;
  selectedProducts.forEach((product) => {
    totalAmount += Number(product.value);
  });
  return totalAmount; // Returning the calculated total amount
}

// Function to update the total amount based on selected products
function updateTotalAmount() {
  const totalAmount = calculateTotalAmount();
  document.getElementById("totalValue").textContent = "AUD $" + totalAmount;
  document.getElementById("registrationTotal").textContent = "AUD $" + totalAmount;
  document.getElementById("amountPayable").textContent = "AUD $" + totalAmount;
}

// Function to handle the behavior when the "Next" button is clicked
function handleNextButtonClick() {
  const form = document.getElementById("registration-form");
  const confirmationSection = document.getElementById("confirmation-section");
  const productsSection = document.querySelector(".product-showcase");
  // Checking if the form is valid and at least one product is selected
  if (form.checkValidity() && calculateTotalAmount() > 0) {
    // If so, hiding the form and showing the confirmation section
    form.classList.add("hidden");
    confirmationSection.classList.remove("hidden");
    productsSection.classList.remove("error");
  } else if (calculateTotalAmount() === 0) {
    // If no product is selected, showing an error message
    productsSection.classList.add("error");
    alert("Please select at least one product from the list.");
  } else {
    // If the form is not valid, reporting validity (will show browser's default validation messages)
    form.reportValidity();
  }
}

// Handle the behavior when the "Back" button is clicked.
function handleBackButtonClick() {
  // Hiding the confirmation section and showing the form
  document.getElementById("confirmation-section").classList.add("hidden");
  document.getElementById("registration-form").classList.remove("hidden");
}

// Function to handle the behavior when the "Pay Now" button is clicked
async function handlePayNowButtonClick() {
  // Creating a formData object with data from the form inputs
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
  // Combining the formData and the calculated total amount into a paymentData object
  const paymentData = { ...formData, wholeNumberAmount: calculateTotalAmount() };
  try {
    // Sending a POST request to the "/initiate-payment" endpoint with the paymentData as JSON
    let response = await fetch("/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    // If the request was successful, redirecting to the URL received in the response
    if (response.ok) {
      let jsonResponse = await response.json();
      window.location.href = jsonResponse.redirectUrl;
    } else {
      alert("There was an issue initiating the payment. Please try again later.");
    }
  } catch (error) {
    alert("Error initiating payment. Please check your connection and try again.");
  }
}
