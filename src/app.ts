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

// get all products
app.get("/api/products", (req, res) => {
  const products = productRepository.find();
  return res.json(products);
});

// create new product
app.post("/api/products", async (req, res) => {
  const product = await productRepository.create(req.body);
  const results = await productRepository.save(product);
  return res.send(results);
});

// get product by id
app.get("/api/products/:id", async (req, res) => {
  const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
  return res.send(product);
});

// update product
app.put("/api/products/:id", async (req, res) => {
  const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
  productRepository.merge(product, req.body);
  const results = await productRepository.save(product);
  return res.send(results);
});

// delete product
app.delete("/api/products/:id", async (req, res) => {
  const result = await productRepository.delete({ id: parseInt(req.params.id) });
  return res.send(result);
});

console.log("listening to port 8000");
app.listen(8000);
