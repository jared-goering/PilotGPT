const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Hardcoded IDs
const assistantId = "asst_dXiC1ER8HT8DhPm5zr77X5sJ";
const vectorStoreId = "vs_VNJ9Q5AZdw0ihHdsgqUAmh40";

async function initializeAssistant() {
  console.log("Using hardcoded assistant and vector store.");
  return { assistantId, vectorStoreId };
}

async function queryDocuments(assistantId, query, userId, threadId) {
  let thread;
  console.log("threadID", threadId);

  if (threadId) {
    // Retrieve and append to the existing thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: query,
    });
    thread = await openai.beta.threads.retrieve(threadId);
  } else {
    // Create a new thread
    thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    });
  }

  return new Promise((resolve, reject) => {
    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistantId,
    });

    let responseText = "";

    stream
      .on("textCreated", () => console.log("assistant >"))
      .on("textDelta", (textDelta) => {
        responseText += textDelta.value;
      })
      .on("messageDone", () => {
        console.log(responseText);
        resolve({ answer: responseText, threadId: thread.id });
      })
      .on("error", (error) => {
        console.error("Error querying documents:", error);
        reject(error);
      });
  });
}

module.exports = {
  initializeAssistant,
  queryDocuments,
};
