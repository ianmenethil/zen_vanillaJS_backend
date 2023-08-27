document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  nextButton.addEventListener("click", handleNextButtonClick);
  backButton.addEventListener("click", handleBackButtonClick);
});

function handleNextButtonClick() {
  document.getElementById("registration-form").style.display = "none";
  document.getElementById("confirmation-section").style.display = "block";
}

function handleBackButtonClick() {
  document.getElementById("confirmation-section").style.display = "none";
  document.getElementById("registration-form").style.display = "block";
}
