import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import {join} from "path";
import axios from 'axios';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const config = {
  postUrl: 'https://jsonplaceholder.typicode.com/posts',
  clerkSecretKey: process.env.CLERK_SECRET_KEY, // Clerk automatically picks this from the env
}
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// Serve React build files (Node 20.11+)
app.use(express.static(join(import.meta.dirname, "dist")));
// Handle React routing - send all other requests to React
app.get('/user/posts', ClerkExpressRequireAuth(), async (req, res) => {
  console.log('REQUEST AUTH: ', req.auth)
  try {
    const { data } = await axios.get(config.postUrl)
    res.json({ posts: data?.slice(0, 5) })
  } catch (err) {
    console.error('Error: ', err)
  }
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});