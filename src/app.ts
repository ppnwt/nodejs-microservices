require("dotenv").config();

import express = require("express");
import cors = require("cors");
import "reflect-metadata";
// Import DB config
import db from "../config/ormconfig";

import { Product } from "./entity/product";

const amqplib = require("amqplib/callback_api");

// Create connection with DB
db;

const productRepository = db.getRepository(Product);

amqplib.connect(process.env.RABBIT_MQ, (err, conn) => {
  if (err) throw err;
  // Listener
  conn.createChannel((err, ch1) => {
    if (err) throw err;

    const app = express();
    app.use(cors({ origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"] }));
    app.use(express.json());

    // get all products
    app.get("/api/products", (req, res) => {
      const products = productRepository.find();
      ch1.assertQueue("tasks");
      ch1.sendToQueue("tasks", Buffer.from("hello"));
      return res.json(products);
    });

    // create new product
    app.post("/api/products", async (req, res) => {
      const product = await productRepository.create(req.body);
      const result = await productRepository.save(product);
      ch1.assertQueue(JSON.stringify(result));
      ch1.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));
      return res.send(result);
    });

    // get product by id
    app.get("/api/products/:id", async (req, res) => {
      const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
      ch1.assertQueue(JSON.stringify(product));
      ch1.sendToQueue("product_get", Buffer.from(JSON.stringify(product)));
      return res.send(product);
    });

    // update product
    app.put("/api/products/:id", async (req, res) => {
      const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
      productRepository.merge(product, req.body);
      const result = await productRepository.save(product);
      ch1.assertQueue(JSON.stringify(result));
      ch1.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)));
      return res.send(result);
    });

    // delete product
    app.delete("/api/products/:id", async (req, res) => {
      const result = await productRepository.delete({ id: parseInt(req.params.id) });
      return res.send(result);
    });

    // add likes
    app.post("/api/products/:id/like", async (req, res) => {
      const product = await productRepository.findOneBy({ id: parseInt(req.params.id) });
      product.likes++;
      const result = await productRepository.save(product);
      return res.send(result);
    });

    console.log("listening to port 8000");
    app.listen(8000);
  });
});
