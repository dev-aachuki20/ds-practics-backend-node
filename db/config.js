const mongoose = require('mongoose');
const dburi = 'mongodb://127.0.0.1:27017/react_node_practice';

const connectDB = async () => {
    try {
        await mongoose.connect(dburi);
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }

}

module.exports = connectDB;