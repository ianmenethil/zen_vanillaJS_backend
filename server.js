const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CryptoJS = require("crypto-js");
const cors = require("cors");
const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://eventsairdemo.azurewebsites.net"] : ["*"];
const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

app.use(bodyParser.json());
app.use(cors({ origin: allowedOrigins }));
app.use(helmet());
app.use(express.static(__dirname));

app.post("/generate-fingerprint", (req, res) => {
  const apiKey = process.env.API_KEY || "defaultApiKey";
  const un = process.env.UN || "defaultUn";
  const pw = process.env.PW || "defaultPw";
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
