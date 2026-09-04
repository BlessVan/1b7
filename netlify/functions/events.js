exports.handler = async function (event) {
  const apiKey = process.env.TICKETMASTER_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server is missing the Ticketmaster API key.' })
    };
  }

  const params = event.queryStringParameters || {};
  const category = params.category || '';
  const scope = params.scope || 'local';
  const zip = params.zip || '';

  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + apiKey +
    '&sort=date,asc&size=15';

  if (category === 'concerts') {
    url += '&classificationName=' + encodeURIComponent('Music');
  } else if (category === 'sports') {
    url += '&classificationName=' + encodeURIComponent('Sports');
  } else if (category === 'theater') {
    url += '&classificationName=' + encodeURIComponent('Arts & Theatre');
  } else if (category === 'gaming') {
    url += '&keyword=' + encodeURIComponent('gaming');
  } else if (category === 'pokemon') {
    url += '&keyword=' + encodeURIComponent('pokemon');
  }

  if (scope === 'local' && zip) {
    url += '&postalCode=' + encodeURIComponent(zip) + '&radius=50&unit=miles';
  } else {
    url += '&countryCode=US';
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch events from Ticketmaster.' })
    };
  }
};
