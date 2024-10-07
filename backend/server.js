// backend/server.js
const express = require("express");
const cors = require("cors");
const { initializeAssistant, queryDocuments } = require("./openai");

const app = express();
const port = 3001;

app.use(express.json({ limit: "100mb" }));
app.use(cors());

let assistantId;

async function initialize() {
  const result = await initializeAssistant();
  assistantId = result.assistantId;
}

initialize();

app.post("/query", async (req, res) => {
  try {
    const { query, userId, threadId } = req.body;
    const response = await queryDocuments(assistantId, query, userId, threadId);
    res.json(response);
  } catch (error) {
    console.error("Error querying documents:", error);
    res.status(500).json({ error: "Error querying documents" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
