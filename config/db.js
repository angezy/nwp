

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/myNewDatabase'; // Update with your database name
const client = new MongoClient(uri);

let isConnected = false; // Track connection status

async function connectToDatabase() {
    if (!isConnected) {
        try {
            await client.connect(); // Connect to the MongoDB server
            isConnected = true;
            console.log('Connected to MongoDB locally');
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err;
        }
    }
    return client.db(); // Return the database instance
}




module.exports = connectToDatabase;
