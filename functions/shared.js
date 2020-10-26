const axios = require('axios');
// const getAccessToken = require('./utils/auth.js').getAccessToken;
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
            body: JSON.stringify(body)
        })
    }

    const getSharedStuff = (email) => {

        const SEARCH_URL = `${API.URL}/api-web/dms/search`;
        const q = {
            fields: [
                'system:objectId',
                'appClient:clienttitle',
                'appClient:clientdescription',
                'system:secondaryObjectTypeIds'
            ],
            filters: [{ "f": "appPersonalfile:pfshare", "o": "in", "v1": [email] }],
            types: ['appPersonalfile:pfshareextension']
        }

        getAccessToken(API.TENANT).then(res => {
            const token = res.data.access_token;
            console.log('token', !!token);
            return axios.post(SEARCH_URL, q, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-ID-TENANT-NAME': API.TENANT
                }
            })
        }).then(res => {
            send(200, res.data.objects.map(o => ({
                id: o.properties['system:objectId'].value,
                title: o.properties['appClient:clienttitle'].value,
                description: o.properties['appClient:clientdescription'].value,
                canComment: o.properties['system:secondaryObjectTypeIds'].value.includes('appPersonalfile:pfnoticesot')
            })))
        }).catch(err => {
            console.log('error', err)
            send(401, err)
        })
    }

    if (event.httpMethod === 'POST') {
        console.log(JSON.parse(event.body).email)
        try {
            getSharedStuff(JSON.parse(event.body).email);
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