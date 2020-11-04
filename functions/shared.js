const axios = require('axios');
const getRequestOptions = require('utils').getRequestOptions;
const getResponseHeaders = require('utils').getResponseHeaders;
const API = require('utils').API;

exports.handler = function (event, context, callback) {

    // send user response
    const send = (status, body) => {
        callback(null, {
            statusCode: status,
            headers: getResponseHeaders(),
            ...(body && {  body: JSON.stringify(body) })
        })
    }

    const getSharedStuff = (email) => {

        const SEARCH_URL = `${API.URL}/api-web/dms/search`;
        const q = {
            fields: [
                'system:objectId',
                'appClient:clienttitle',
                'appClient:clientdescription',
                'system:contentStreamFileName',
                'system:secondaryObjectTypeIds'
            ],
            filters: [{ "f": "appPersonalfile:pfshare", "o": "in", "v1": [email] }],
            types: ['appPersonalfile:pfshareextension']
        }
        getRequestOptions(API.TENANT).then(options => {
            return axios.post(SEARCH_URL, q, options);
        }).then(res => {
            send(200, res.data.objects.map(o => ({
                id: o.properties['system:objectId'].value,
                title: o.properties['appClient:clienttitle'] ? o.properties['appClient:clienttitle'].value : 'Untitled',
                description: o.properties['appClient:clientdescription'] ? o.properties['appClient:clientdescription'].value : '',
                contentFilename: o.contentStreams[0] && o.contentStreams[0]['fileName'],
                // description: o.properties['appClient:clientdescription'].value,
                canComment: o.properties['system:secondaryObjectTypeIds'].value.includes('appPersonalfile:pfnoticesot')
            })))
        }).catch(err => {
            console.log('error', err)
            send(401, err)
        })
    }

    if (event.httpMethod === 'POST') {
        try {
            getSharedStuff(JSON.parse(event.body).email);
        } catch (e) {
            console.log(JSON.stringify(e, null, 2));
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