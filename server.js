const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CryptoJS = require("crypto-js");
const cors = require("cors");
const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://eventsairdemodev.azurewebsites.net"] : ["*"];
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios");
require("dotenv").config();
console.log("Current NODE_ENV:", process.env.NODE_ENV);
// Logging middleware
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});
app.use(bodyParser.json());
app.use(cors({ origin: allowedOrigins }));
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
app.use(express.static(__dirname));
app.post("/initiate-payment", async (req, res) => {
  console.log("Received request for /initiate-payment with data:", req.body);
  const formData = req.body;
  const apiKey = process.env.API_KEY;
  const un = process.env.UN;
  const pw = process.env.PW;
  const payMode = "0";
  const mUPID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const strFingerprint = CryptoJS.SHA1(apiKey + "|" + un + "|" + pw + "|" + payMode + "|" + formData.wholeNumberAmount + "|" + mUPID).toString();
  const paymentAmount = (formData.wholeNumberAmount / 100).toFixed(2);
  const paymentData = {
    IsJsPlugin: "True",
    Mode: payMode,
    Token: "",
    AdditionalReference: "",
    AustralianBusinessNumber: "",
    CallbackUrl: "",
    CompanyName: "",
    ContactNumber: formData.mobile,
    CustomerEmail: formData.email,
    CustomerId: "",
    CustomerName: `${formData.firstName}+${formData.lastName}`,
    CustomerReference: formData.companyName,
    HideHeader: "true",
    HideMerchantLogo: "",
    PaymentAmount: paymentAmount,
    RedirectUrl: "https://eventsairdemodev.azurewebsites.net/response.html",
    ReturnUrl: "",
    MerchantUniquePaymentId: mUPID,
    SendConfirmationEmailToMerchant: "False",
    __ApiKey: apiKey,
    __Fingerprint: strFingerprint,
    HideTermsAndConditions: "False",
    ShowFeeOnTokenising: "False",
    ShowFailedPaymentFeeOnTokenising: "False",
    AllowBankAcOneOffPayment: "False",
    AllowPayIdOneOffPayment: "False",
    AllowApplePayOneOffPayment: "False",
    OverrideFeePayer: "0",
    UserMode: "0",
    MinHeight: "0",
  };
  try {
    console.log("Making a request to payment API:", "https://payuat.travelpay.com.au/Online/Payment?version=v3", paymentData);
    const paymentResponse = await axios.post("https://payuat.travelpay.com.au/Online/Payment?version=v3", paymentData);
    console.log("Response from payment API:", paymentResponse.data);
    res.send(paymentResponse.data);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Error initiating payment." });
  }
});

app.post("/generate-fingerprint", (req, res) => {
  const apiKey = process.env.API_KEY;
  const un = process.env.UN;
  const pw = process.env.PW;
  const { payMode, wholeNumberAmount, mUPID } = req.body;
  console.log("req.body", req.body);
  const strFingerprint = CryptoJS.SHA1(apiKey + "|" + un + "|" + pw + "|" + payMode + "|" + wholeNumberAmount + "|" + mUPID).toString();
  console.log("strFingerprint", strFingerprint);
  res.json({ fingerprint: strFingerprint });
});

app.get("/generate-mupid", (req, res) => {
  const mUPID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.log("mUPID", mUPID);
  res.json({ mUPID });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
