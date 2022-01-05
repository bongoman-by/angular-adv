// подключение express
const express = require("express");
const { db } = require("./database/config");
require("dotenv").config();
const cors = require("cors");
// создаем объект приложения
const app = express();

//Config cors
app.use(cors());

// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
  response.send("<h2>Express works!</h2>");
});
// MongoDB admin JQdATFho1Ggy2Zms
const port = parseInt(process.env.PORT, 10) || 8000;
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});

const connect = db(process.env.DB_CNN);
