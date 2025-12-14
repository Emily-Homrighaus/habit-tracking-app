import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records in order of most recent first.
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("records");
    let results = await collection
      .find({})
      .sort({ eatenAt: -1 })
      .toArray();

    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching calorie entries");
  }
});


// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("records");

    let query = {
      _id: new ObjectId(req.params.id),
    };

    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid ID format");
  }
});


// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    const { foodItem, calories, eatenAt } = req.body;

    // basic validation
    if (!foodItem || !calories || !eatenAt) {
      return res.status(400).send("Missing required fields");
    }

    let newDocument = {
      foodItem,
      calories: Number(calories),
      eatenAt: new Date(eatenAt),
    };

    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding calorie entry");
  }
});


// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const updates = {};
    if (req.body.foodItem !== undefined)
      updates.foodItem = req.body.foodItem;

    if (req.body.calories !== undefined)
      updates.calories = Number(req.body.calories);

    if (req.body.eatenAt !== undefined)
      updates.eatenAt = new Date(req.body.eatenAt);

    const updateDoc = { $set: updates };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updateDoc);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating calorie entry");
  }
});


// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid ID or error deleting record");
  }
});


export default router;