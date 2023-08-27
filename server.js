const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CryptoJS = require("crypto-js");
const cors = require("cors");
const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://eventsairdemodev.azurewebsites.net"] : ["*"];
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios");

// Logging middleware
app.use((req, res, next) => {
  // console.log("Incoming request:", req.method, req.path);
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
  const formData = req.body;
  const apiKey = process.env.API_KEY || "defaultApiKey";
  const un = process.env.UN || "defaultUn";
  const pw = process.env.PW || "defaultPw";
  const strFingerprint = CryptoJS.SHA1(apiKey + "|" + un + "|" + pw + "|" + formData.payMode + "|" + formData.wholeNumberAmount + "|" + formData.mUPID).toString();

  const paymentData = {
    __ApiKey: apiKey,
    __Fingerprint: strFingerprint,
  };

  try {
    const paymentResponse = await axios.post("https://payuat.travelpay.com.au/Online/Payment?version=v3", paymentData);
    const redirectUrl = paymentResponse.data.url;
    res.json({ redirectUrl });
  } catch (error) {
    res.status(500).json({ error: "Error initiating payment." });
  }
});

app.post("/generate-fingerprint", (req, res) => {
  const apiKey = process.env.API_KEY;
  const un = process.env.UN;
  const pw = process.env.PW;
  const { payMode, wholeNumberAmount, mUPID } = req.body;
  // console.log("req.body", req.body);
  const strFingerprint = CryptoJS.SHA1(apiKey + "|" + un + "|" + pw + "|" + payMode + "|" + wholeNumberAmount + "|" + mUPID).toString();
  // console.log("strFingerprint", strFingerprint);
  res.json({ fingerprint: strFingerprint });
});

app.get("/generate-mupid", (req, res) => {
  const mUPID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // console.log("mUPID", mUPID);
  res.json({ mUPID });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});
