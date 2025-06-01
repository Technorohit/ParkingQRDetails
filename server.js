const express = require("express");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/generate", async (req, res) => {
  const { mobile, flat } = req.body;
  const qrUrl = `http://localhost:3000/view?mobile=${encodeURIComponent(
    mobile
  )}&flat=${encodeURIComponent(flat)}`;

  try {
    const qrImage = await QRCode.toDataURL(qrUrl);
    res.send(`
  <html>
  <head>
    <title>QR Code</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>Adore Samriddhi</header>
    <div class="card" id="print-area">
      <h2>Your QR Code</h2>
      <img src="${qrImage}" alt="QR Code" />
    </div>
    <button onclick="window.print()" style="margin-top: 20px;">🖨️ Print</button>
  </body>
  </html>
`);
  } catch (err) {
    res.status(500).send("Error generating QR");
  }
});

app.get("/view", (req, res) => {
    console.log("query",req.query)
  const { mobile, flat } = req.query;

  if (!mobile || !flat) return res.status(400).send("Missing info");

  res.send(`
  <html>
  <head>
    <title>Resident Info</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <header>Adore Samriddhi</header>
    <div class="card">
      <h2>Resident Info</h2>
      <p><strong>Mobile:</strong> <a href="tel:${mobile}">${mobile}</a></p>
      <p><strong>Flat:</strong> ${flat}</p>
    </div>
  </body>
  </html>
`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
