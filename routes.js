const express = require('express');
const {
    getEventById,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('./controller');

function setupRoutes(collection) {
    const router = express.Router();

    router.get('/events', async (req, res) => {
        try {
            const { id, type, limit, page } = req.query;
            if (id) {
                const event = await getEventById(collection, id);
                return res.send(event);
            } else {
                const events = await getEvents(collection, type, parseInt(limit), parseInt(page));
                return res.send(events);
            }
        } catch (err) {
            res.status(err.status || 500).send({ error: err.message || 'Internal server error' });
        }
    });

    router.post('/events', async (req, res) => {
        try {
            const event = req.body;
            const result = await createEvent(collection, event);
            res.status(201).send(result);
        } catch (err) {
            res.status(500).send({ error: 'Internal server error' });
        }
    });

    router.put('/events/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await updateEvent(collection, id, updateData);
            res.send(result);
        } catch (err) {
            res.status(err.status || 500).send({ error: err.message || 'Internal server error' });
        }
    });

    router.delete('/events/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const result = await deleteEvent(collection, id);
            res.send(result);
        } catch (err) {
            res.status(err.status || 500).send({ error: err.message || 'Internal server error' });
        }
    });

    return router;
}

module.exports = setupRoutes;