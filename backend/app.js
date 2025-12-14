import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import {join} from "path";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// Serve React build files (Node 20.11+)
app.use(express.static(join(import.meta.dirname, "dist")));
// Handle React routing - send all other requests to React
app.get("/files{/*path}", (req, res) => {
  res.sendFile(join(import.meta.dirname, "dist", "index.html"));
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});