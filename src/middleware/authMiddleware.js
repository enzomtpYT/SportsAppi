// Authentication middleware to check API key
const authMiddleware = (req, res, next) => {
    // Get the API key from request body, query or headers
    const providedApiKey = req.body.apiKey || req.query.apiKey || req.headers['authorization'];
    const API_KEY = process.env.API_KEY;
    
    // Check if API_KEY is configured
    if (!API_KEY) {
        console.error('API_KEY not configured in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Check if API key is provided and correct
    if (!providedApiKey || providedApiKey !== API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    // If API key is valid, proceed to the next middleware
    next();
};

module.exports = authMiddleware;