require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = 3000;

// app.use(cors({
//   origin: "http://localhost:5173/",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type"]
// }));


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svgbh.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffees");

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


    app.get("/coffees", async (req, res) => {
      try {
        const coffees = await coffeeCollection.find().toArray();
        res.send(coffees)
      }
      catch (error){
        res.status(500).send({ message: "Failed to fetch coffees" });
      }
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// Root route
app.get("/", (req, res) => {
  res.send("Coffee server is running...");
});


// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
