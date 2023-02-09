import express = require("express");
import cors = require("cors");

console.log("hello bt");

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"] }));

app.listen(8000);
