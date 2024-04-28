const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyujvjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const artsCollection = client.db('artsDB').collection('arts')

    // read data for home page
    app.get('/getCrafts', async(req, res)=>{
      const limit = parseInt(req.query.limit) || 6;
      const cursor = artsCollection.find().limit(limit)
      const result = await cursor.toArray()
      res.send(result)
    })

    // read data for all art & craft items
    app.get('/getAllCrafts', async(req, res)=>{
      const cursor = artsCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    // read data by user email
    app.get('/myList/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {email: email}
      const cursor = artsCollection.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })

    // view details of specific id
    app.get('/getCrafts/:id', async(req, res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await artsCollection.findOne(query)
      res.send(result)
    })

    // create data
    app.post('/addCrafts', async(req, res)=>{
      const newArts = req.body;
      console.log(newArts);
      const result = await artsCollection.insertOne(newArts)
      res.send(result)
    })

    // update data
    app.get('/update/:id', async(req, res)=>{
      const result = await artsCollection.findOne({_id: new ObjectId(req.params.id)});
      res.send(result)
    })

    app.put('/updateItem/:id', async(req, res)=>{
      const query = { _id: new ObjectId(req.params.id) }
      const data = {
        $set: {
          image: req.body.image,
          itemName: req.body.itemName,
          subcategory: req.body.subcategory,
          customization: req.body.customization,
          description: req.body.description,
          price: req.body.price,
          rating: req.body.rating,
          processingTime: req.body.processingTime,
          stockStatus: req.body.stockStatus,
        }
      }
      const result = await artsCollection.updateOne(query, data)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Arts & Crafts server side running')
})

app.listen(port, ()=>{
    console.log('Arts & Crafts running on port: ', port)
})