// Importing necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CryptoJS = require("crypto-js");
const cors = require("cors");

// Defining allowed origins based on NODE_ENV variable
const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://eventsairdemodev.azurewebsites.net"] : ["*"];

// Creating an instance of the Express application
const app = express();
const PORT = process.env.PORT || 3000;
// const axios = require("axios");
require("dotenv").config();
console.log("Current NODE_ENV:", process.env.NODE_ENV);

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

// Parsing JSON data in the request body
app.use(bodyParser.json());

// Allowing cross-origin requests from defined origins
app.use(cors({ origin: allowedOrigins }));

// Adding security headers using Helmet middleware
app.use(helmet());

// Change to this after testing //
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
//     styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
//     imgSrc: ["'self'", "data:"],
//     connectSrc: ["'self'", "payuat.travelpay.com.au"],
//     fontSrc: ["'self'", "cdn.jsdelivr.net"],
//   }
// }));

// Custom CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "*"],
      styleSrc: ["'self'", "'unsafe-inline'", "*"],
      imgSrc: ["'self'", "data:", "*"],
      connectSrc: ["'self'", "*"],
      fontSrc: ["'self'", "*"],
      formAction: ["'self'", "*"],
      frameAncestors: ["'self'", "*"],
    },
  })
);

// Serving static files from the current directory
app.use(express.static(__dirname));

// Route for handling payment initiation
app.post("/initiate-payment", async (req, res) => {
  console.log("Received payment initiation request:", req.body);
  // Extracting data from the request body
  const formData = req.body;
  const wholeNumberAmountForFingerprint = formData.wholeNumberAmount * 100;

  // Fetching API key, username, and password from environment variables
  const apiKey = process.env.API_KEY;
  const un = process.env.UN;
  const pw = process.env.PW;

  // Setting payment mode and generating a unique ID for the payment
  const payMode = "0";
  const mUPID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Generating fingerprint using CryptoJS library
  const strFingerprint = CryptoJS.SHA1(apiKey + "|" + un + "|" + pw + "|" + payMode + "|" + wholeNumberAmountForFingerprint + "|" + mUPID).toString();

  // Formatting payment amount and constructing payment data object
  const paymentAmount = formData.wholeNumberAmount.toFixed(2);
  const paymentData = {
    IsJsPlugin: "True",
    Mode: payMode,
    // Token: "",
    // AdditionalReference: "",
    // AustralianBusinessNumber: "",
    // CallbackUrl: "",
    // CompanyName: "",
    ContactNumber: formData.mobile,
    CustomerEmail: formData.email,
    // CustomerId: "",
    CustomerName: `${formData.firstName} ${formData.lastName}`,
    CustomerReference: formData.companyName,
    HideHeader: "True",
    HideMerchantLogo: "False",
    PaymentAmount: paymentAmount,
    RedirectUrl: "https://eventsairdemodev.azurewebsites.net/response.html",
    // ReturnUrl: "",
    MerchantUniquePaymentId: mUPID,
    SendConfirmationEmailToMerchant: "True",
    __ApiKey: apiKey,
    __Fingerprint: strFingerprint,
    HideTermsAndConditions: "False",
    // ShowFeeOnTokenising: "False",
    // ShowFailedPaymentFeeOnTokenising: "False",
    // AllowBankAcOneOffPayment: "False",
    // AllowPayIdOneOffPayment: "False",
    // AllowApplePayOneOffPayment: "False",
    // OverrideFeePayer: "0",
    // UserMode: "0",
    // MinHeight: "0",
  };
  try {
    const baseUrl = "https://payuat.travelpay.com.au/Online/v3/Authorise?";
    const queryString = new URLSearchParams(paymentData).toString();
    console.log("Redirect URL:", `${baseUrl}${queryString}`);
    const redirectUrl = `${baseUrl}${queryString}`;

    // Sending the redirect URL in the response
    res.json({ redirectUrl: redirectUrl });
  } catch (error) {
    // Handling error if payment initiation fails
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Error initiating payment." });
  }
});

// // Route for generating fingerprint
// app.post("/generate-fingerprint", (req, res) => {
//   // Fetching API key, username, and password from environment variables
//   const apiKey = process.env.API_KEY;
//   const un = process.env.UN;
//   const pw = process.env.PW;

//   // Extracting data from the request body
//   const wholeNumberAmountForFingerprint = req.body.wholeNumberAmount * 100; // Convert to whole number for fingerprint generation
//   const { payMode, mUPID } = req.body;
//   console.log("req.body", req.body);

//   // Generating fingerprint using CryptoJS library
//   const strFingerprint = CryptoJS.SHA1(apiKey + "|" + un + "|" + pw + "|" + payMode + "|" + wholeNumberAmountForFingerprint + "|" + mUPID).toString();
//   console.log("strFingerprint", strFingerprint);

//   // Sending the generated fingerprint in the response
//   res.json({ fingerprint: strFingerprint });
// });

// // Route for generating a unique ID for payment
// app.get("/generate-mupid", (req, res) => {
//   // Generating a unique ID using Math.random() and converting it to a string
//   const mUPID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//   console.log("mUPID", mUPID);
//   // Sending the generated unique ID in the response
//   res.json({ mUPID });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
