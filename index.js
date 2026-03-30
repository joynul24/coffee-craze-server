require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require("mongodb");

const app = express();
// const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://coffee-craze.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svgbh.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffees");


    // Post Delete 
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await coffeeCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });



    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await coffeeCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to fetch coffee details" });
      }
    });


    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;

      try {
        const result = await coffeeCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedCoffee }
        );
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to update coffee" });
      }
    });



    // POST route
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      try {
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to add coffee" });
      }
    });

    // GET route
    app.get("/coffees", async (req, res) => {
      try {
        const coffees = await coffeeCollection.find().toArray();
        res.send(coffees);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch coffees" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run().catch(console.dir);

// Root route
app.get("/", (req, res) => {
  res.send("Coffee server is running...");
});

// Vercel‑friendly export (❌ app.listen নয়)
module.exports = app;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });