require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");

const { db } = require("./database/config");

// server
const app = express();

//Config cors
app.use(cors());

app.use(express.json());

//routes
app.use("/api/login", require("./routes/auth"));
app.use("/api/search", require("./routes/search"));
app.use("/api/upload", require("./routes/uploads"));

app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/doctors", require("./routes/doctors"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "public/index.html"));
// });

// app.use(express.static("projects/backend-server/public"));

const _app_folder = __dirname + "/public";
// ---- SERVE STATIC FILES ---- //
app.get("*.*", express.static(_app_folder, { maxAge: "1y" }));

// ---- SERVE APPLICATION PATHS ---- //
app.all("*", function (req, res) {
  res.status(200).sendFile(`/`, { root: _app_folder });
});

db(process.env.DB_CNN);

// MongoDB admin JQdATFho1Ggy2Zms
const port = parseInt(process.env.PORT, 10) || 8000;
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
