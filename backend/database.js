const { MongoClient, ServerApiVersion } = require('mongodb');
const password="XrE03kaNVRiE6u4M"

const uri =`mongodb+srv://bryansmoreno26:${password}@cluster0.tjdwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

module.exports = client;