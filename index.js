const express = require('express');
const { connectDB, client } = require('./connection');
const setupRoutes = require('./routes');

const app = express();
app.use(express.json());

(async () => {
    try {
        const db = await connectDB();
        const collection = db.collection('events');

        app.use('/api/v3/app', setupRoutes(collection));

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
})();

process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
