document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  nextButton.addEventListener("click", handleNextButtonClick);
  backButton.addEventListener("click", handleBackButtonClick);
});

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
