const axios = require('axios');

exports.handler = function (event, context, callback) {

    const {API_URL, API_TENANT, API_TOKEN} = process.env;
    const headers = {};
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
    headers['X-ID-TENANT-NAME'] = API_TENANT;

    const responsHeaders = {};
    responsHeaders['Access-Control-Allow-Origin'] = '*';
    responsHeaders['Access-Control-Allow-Headers'] = 'Origin, X-Requested-Width, Content-Type, Accept';

    const URL = `${API_URL}/api/dms/schema/native.json`;

    // send user respone
    const send = (status, body) => {
        callback(null, {
            statusCode: status,
            headers: responsHeaders,
            body: JSON.stringify(body)
        })
    }

    const getX = () => {
        axios.get(URL, {
            headers: headers
        }).then(res => send(200, res.data)).catch(err => send(500, err))
    }

    if (event.httpMethod === 'GET') {
        getX();
    } else {
        send(422, {})
    }
}