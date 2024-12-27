const { ObjectId } = require('mongodb');

async function getEventById(collection, id) {
    if (!id) {
        throw { status: 400, message: 'Event ID is required' };
    }
    const event = await collection.findOne({ _id: new ObjectId(id) });
    if (!event) {
        throw { status: 404, message: 'Event not found' };
    }
    return event;
}

async function getEvents(collection, type, limit = 5, page = 1) {
    if (type !== 'latest') {
        throw { status: 400, message: 'Invalid type parameter' };
    }
    const events = await collection
        .find({})
        .sort({ schedule: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
    return events;
}

async function createEvent(collection, event) {
    const result = await collection.insertOne(event);
    return { id: result.insertedId };
}

async function updateEvent(collection, id, updateData) {
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    if (result.matchedCount === 0) {
        throw { status: 404, message: 'Event not found' };
    }
    return { message: 'Event updated successfully' };
}

async function deleteEvent(collection, id) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        throw { status: 404, message: 'Event not found' };
    }
    return { message: 'Event deleted successfully' };
}

module.exports = {
    getEventById,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
