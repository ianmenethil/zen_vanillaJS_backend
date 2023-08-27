document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("next-button");
  const backButton = document.getElementById("back-button");
  // const payNowButton = document.getElementById('pay-now-button');

  nextButton.addEventListener("click", handleNextButtonClick);
  backButton.addEventListener("click", handleBackButtonClick);
  // payNowButton.addEventListener('click', handlePayNowButtonClick);
});

function handleNextButtonClick() {
  document.getElementById("registration-form").style.display = "none";
  document.getElementById("confirmation-section").style.display = "block";
}

function handleBackButtonClick() {
  document.getElementById("confirmation-section").style.display = "none";
  document.getElementById("registration-form").style.display = "block";
}
