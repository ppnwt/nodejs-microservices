import express = require("express");
import cors = require("cors");
import "reflect-metadata";
// Import DB config
import db from "../config/ormconfig";

import { Product } from "./entity/product";

// Create connection with DB
db;

const productRepository = db.getRepository(Product);

const app = express();
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"] }));
app.use(express.json());

app.get("/api/products", (req, res) => {
  const products = productRepository.find();

  res.json(products);
});

console.log("listening to port 8000");
app.listen(8000);
