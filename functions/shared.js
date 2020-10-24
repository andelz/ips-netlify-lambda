const axios = require('axios');
const qs = require('querystring');

exports.handler = function (event, context, callback) {
    // TODO: https://docs.netlify.com/functions/functions-and-identity/

    const { API_CLIENT_SECRET, API_USERNAME, API_PASSWORD } = process.env;

    const API_TENANT = "kolibri";
    const AUTH_URL = `https://auth.enaioci.net/auth/realms/${API_TENANT}/protocol/openid-connect/token`;
    const API_URL = "https://kolibri.enaioci.net";

    const SEARCH_URL = `${API_URL}/api/dms/objects/search`;

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

        // query to fetch the shared files
        const q = {
            "query": {
                "statement": `select system:objectId, appClient:clienttitle,appClient:clientdescription, system:secondaryObjectTypeIds from appPersonalfile:pfshareextension where appPersonalfile:pfshare contains('${email}')`
            }
        }

        getAccessToken().then(res => {
            const token = res.data.access_token;
            axios.post(SEARCH_URL, q, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-ID-TENANT-NAME': API_TENANT
                }
            }).then(res => send(200, res.data.objects.map(o => ({
                id: o.properties['system:objectId'].value,
                title: o.properties['appClient:clienttitle'].value,
                description: o.properties['appClient:clientdescription'].value,
                canComment: o.properties['system:secondaryObjectTypeIds'].value.includes('noticeextension')
            })))).catch(err => send(500, err))

        }).catch(err => send(401, err))
    }

    const getAccessToken = () => {
        return axios.post(AUTH_URL, qs.stringify({
            client_id: API_TENANT,
            grant_type: 'password',
            client_secret: API_CLIENT_SECRET,
            scope: 'openid',
            username: API_USERNAME,
            password: API_PASSWORD,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    if (event.httpMethod === 'POST') {
        try {
            getSharedStuff(JSON.parse(event.body).email);
        } catch (e) {
            send(422, {})
        }
    }
    else if (event.httpMethod === 'OPTIONS') {
        send(200, {})
    }
    else {
        send(422, {})
    }
}