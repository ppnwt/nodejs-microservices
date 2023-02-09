import express = require("express");
import cors = require("cors");
import "reflect-metadata";

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"] }));

app.use(express.json());

console.log("listening to port 8000");

app.listen(8000);
