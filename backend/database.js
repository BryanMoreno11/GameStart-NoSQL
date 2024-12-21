const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bryansmoreno26:t0OvAsEhOEmxJbn7@cluster0.tjdwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

module.exports= client;