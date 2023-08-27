const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CryptoJS = require("crypto-js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

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

app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
