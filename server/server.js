


const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let currentCommand = "AUTO";

// React sends command here
app.post("/motor", (req, res) => {
  currentCommand = req.body.status;
  console.log("Received:", currentCommand);
  res.send({ success: true });
});

// ESP / Arduino fetches command here
app.get("/getCommand", (req, res) => {
  res.send(currentCommand);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});