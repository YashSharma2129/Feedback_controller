import { connectToDatabase } from './utils/db';

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let client;

  console.log("POST /submit-feedback called");

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);
    
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name, email, and message are required' }),
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    const newFeedback = {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    await db.collection('feedbacks').insertOne(newFeedback);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Feedback submitted successfully',
        feedback: newFeedback
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error('Error closing client:', e);
      }
    }
  }
};
