// This function runs on Netlify's server, not in the visitor's browser.
// It receives a code, checks it privately, and only ever replies
// "correct" or "incorrect" — the actual list of codes never leaves the server.

const accessCodes = require('./access-codes.json');

exports.handler = async (event) => {
  // Only allow POST requests (someone submitting a code)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code } = JSON.parse(event.body);
    const cleanCode = (code || '').trim();

    if (accessCodes[cleanCode]) {
      // Correct code — tell the browser which page to go to
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          page: accessCodes[cleanCode]
        })
      };
    } else {
      // Incorrect code — do not reveal anything else
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false
        })
      };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Something went wrong reading the request.' })
    };
  }
};
