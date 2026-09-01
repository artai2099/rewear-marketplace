export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({
      error: 'Method not allowed'
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return response.status(500).json({
      error: 'Database variables are not configured'
    });
  }

  try {
    const endpoint = new URL(
      '/rest/v1/listings',
      supabaseUrl
    );

    endpoint.searchParams.set('select', '*');
    endpoint.searchParams.set('status', 'eq.active');
    endpoint.searchParams.set(
      'order',
      'created_at.desc'
    );

    const databaseResponse = await fetch(endpoint, {
      headers: {
        apikey: publishableKey,
        Accept: 'application/json'
      }
    });

    if (!databaseResponse.ok) {
      return response.status(502).json({
        error: 'Unable to retrieve listings'
      });
    }

    const listings = await databaseResponse.json();

    return response.status(200).json(listings);
  } catch (error) {
    console.error(error);

    return response.status(500).json({
      error: 'Unable to retrieve listings'
    });
  }
}
