const axios = require('axios');
const getAccessToken = require('./utils/index.js').getAccessToken;
const API = require('./utils/index.js').API;

exports.handler = function (event, context, callback) {

    // send user response
    const send = (status, body) => {
        const responsHeaders = {};
        responsHeaders['Access-Control-Allow-Origin'] = '*';
        responsHeaders['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, DELETE, PUT';
        responsHeaders['Access-Control-Allow-Headers'] = 'Origin, X-Requested-Width, Content-Type, Accept';
        callback(null, {
            statusCode: status,
            headers: responsHeaders,
            body: body
        })
    }

    const download = (objectId) => {
        getAccessToken(API.TENANT).then(res => {
            const token = res.data.access_token;
            console.log('token', !!token);
            return axios.get(`${API.URL}/api-web/dms/${objectId}/content`, q, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-ID-TENANT-NAME': API.TENANT
                }
            })
        }).then(res => {
            send(200, res.body)
        })
    }

    if (event.httpMethod === 'GET') {
        try {
            download(JSON.parse(event.body).id);
        } catch (e) {
            send(422, { dd: e })
        }
    }
    else if (event.httpMethod === 'OPTIONS') {
        send(200, {})
    }
    else {
        send(422, { x: 'D' })
    }
}