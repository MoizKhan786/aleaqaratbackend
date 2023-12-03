const { response_headers } = require('./constants')

exports.handler = async (event) => {
    console.log(event)
    const response = {
        statusCode: 200,
        headers: response_headers,
        body: JSON.stringify('CORS configuration handled successfully'),
    };

    if (event.httpMethod === 'OPTIONS') {
        return response;
    }

    return response;
};