const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();


// Middleware

app.use(cors());
app.use(express.json());


// APIs



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnrec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bikesCollection = client.db('warehouse').collection('bikes');

        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikesCollection.find(query);
            const bikes = await cursor.toArray();
            res.send(bikes);
        })
        // Update
        app.put('/bikes/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedBike = req.body;
            const filter = {_id:ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set:{quantity: updatedBike.quantity}
            };
            const result =await bikesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const place = await bikesCollection.findOne(query);
            res.send(place);

        })
        
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const place = await bikesCollection.deleteOne(query);
            res.send(place);
        })

        app.post('/bikes', async(req, res)=>{
            const newPlace = req.body;
            const result = await bikesCollection.insertOne(newPlace);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send("Root folder is working");
})

app.listen(port, () => {
    console.log('All the services should be here');
})
