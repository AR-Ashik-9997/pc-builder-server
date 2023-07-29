const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function connect() {
  try {
    const ProductsCollection = client
      .db("PC-Builder")
      .collection("FeaturedProducts");    

    app.get("/limit-products", async (req, res) => {
      const result = await ProductsCollection.find({}).limit(8).toArray();
      res.send({ message: "success", status: 200, data: result });
    });
    app.get("/all-products", async (req, res) => {
      const result = await ProductsCollection.find({}).toArray();
      res.send({ message: "success", status: 200, data: result });
    });
    app.get("/single-product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ProductsCollection.findOne(query);
      res.send({ message: "success", status: 200, data: result });
    });   
    app.get("/single-categories/:id", async (req, res) => {
      const category = req.params.id;
      const query = { queryName: category };     
      const result = await ProductsCollection.find(query).toArray();
      res.send({ message: "success", status: 200, data: result });
    });
  } finally {
  }
}
connect().catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
