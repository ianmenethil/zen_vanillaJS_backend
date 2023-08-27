const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const CryptoJS = require("crypto-js");
const cors = require("cors");
const allowedOrigins = process.env.NODE_ENV === "production" ? ["https://eventsairdemo.ianmenethil.com"] : ["*"];
const app = express();
const PORT = process.env.PORT || 3000;

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
