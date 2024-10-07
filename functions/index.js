const functions = require('firebase-functions');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

admin.initializeApp();

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: functions.config().openai.apikey,
});

// Retrieve assistant ID from environment variables
const assistantId = functions.config().openai.assistant_id;

/**
 * Queries documents using OpenAI API.
 * @param {string} assistantId - The assistant ID.
 * @param {string} query - The user's query.
 * @param {string} userId - The user's ID.
 * @param {string} threadId - The thread ID.
 * @return {Promise<Object>} The response from OpenAI.
 */
async function queryDocuments(assistantId, query, userId, threadId) {
  let thread;
  console.log('threadID', threadId);

  if (threadId) {
    // Append to existing thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: query,
    });
    thread = await openai.beta.threads.retrieve(threadId);
  } else {
    // Create a new thread
    thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
    });
  }

  return new Promise((resolve, reject) => {
    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistantId,
    });

    let responseText = '';

    stream
      .on('textCreated', () => console.log('assistant >'))
      .on('textDelta', (textDelta) => {
        responseText += textDelta.value;
      })
      .on('messageDone', () => {
        console.log(responseText);
        resolve({ answer: responseText, threadId: thread.id });
      })
      .on('error', (error) => {
        console.error('Error querying documents:', error);
        reject(error);
      });
  });
}

/**
 * Cloud Function to handle queries.
 */
exports.query = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const idToken = req.headers.authorization
      ? req.headers.authorization.split('Bearer ')[1]
      : null;

    if (!idToken) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const { query, threadId } = req.body;
      const response = await queryDocuments(assistantId, query, uid, threadId);
      res.json(response);
    } catch (error) {
      console.error('Error verifying ID token or querying documents:', error);
      res.status(500).json({ error: 'Error querying documents' });
    }
  });
});
