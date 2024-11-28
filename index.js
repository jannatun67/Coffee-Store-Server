const express = require('express')
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const app = express()
require('dotenv').config()

// middleware

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.dq9u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("DB");
    const databaseCollection = database.collection("haiku");

    app.post('/coffee', async (req,res)=>{
        const product =req.body;
        console.log(product);
        const result = await databaseCollection.insertOne(product);
        res.send(result)
    })

    app.get('/coffees',async(req,res)=>{
        const query= {}
        const cursor = databaseCollection.find(query);
        const result= await cursor.toArray();
        res.send(result)
    })

    app.delete('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id :new ObjectId(id)};
      const result = await databaseCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:new ObjectId(id) };
        const result = await databaseCollection.findOne(query);
        res.send(result)
    })

    app.put ('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const  filter = { _id:new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee= req.body
      const Coffee = {
        $set: {
          name:updateCoffee.name,
          chef:updateCoffee.chef,
          supplier:updateCoffee.supplier,
          taste:updateCoffee, 
          category:updateCoffee, 
          details:updateCoffee.details, 
          photo:updateCoffee.photo
        },
      };
      const result = await databaseCollection.updateOne(filter, Coffee, options);
      res.send(result)
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



app.get('/', (req, res) => {
    res.send('Coffee Store server is running')
  })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })