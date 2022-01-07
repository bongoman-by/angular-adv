require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { db } = require("./database/config");

// server
const app = express();

//Config cors
app.use(cors());

app.use(express.json());

//routes
app.use("/api/users", require("./routes/users"));
app.use("/api/login", require("./routes/auth"));

db(process.env.DB_CNN);

// MongoDB admin JQdATFho1Ggy2Zms
const port = parseInt(process.env.PORT, 10) || 8000;
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
