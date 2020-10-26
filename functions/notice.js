const axios = require('axios');
// const getAccessToken = require('./utils/auth.js').getAccessToken;
const getAccessToken = require('./utils/index.js').getAccessToken;
const API = require('./utils/index.js').API;


// add a notice
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

    const addNotice = (objectId, msg) => {
        
        const UPDATE_URL = `${API.URL}/api-web/dms/update/${objectId}`;
        const SEARCH_URL = `${API.URL}/api/dms/objects/search`;
const NOTICE_FIELD = 'appPersonalfile:pfnotice';

        let headers;

        getAccessToken(API.TENANT).then(res => {
            // token = res.data.access_token;

            headers = {
                headers: {
                    'Authorization': `Bearer ${res.data.access_token}`,
                    'X-ID-TENANT-NAME': API.TENANT
                }
            }

            // load the current notice
            const q = {
                "query": {
                    "statement": `select ${NOTICE_FIELD} from appPersonalfile:pfnoticesot where system:objectId='${objectId}'`
                }
            }
            return axios.post(SEARCH_URL, q, headers)
            }).then(res => {
                const prop = res.data.objects[0].properties[NOTICE_FIELD];
                const data = {};
                data[NOTICE_FIELD] = `${prop ? prop.value : ''}\n${msg}`;
                return axios.patch(UPDATE_URL, data, headers)
            }).then(res => {
                send(200, {})
            }).catch(err => {
                console.log(err);
                send(500, err)
            })
            
            
            
            
            
            
            
        //     .then(res => {
        //         const notice = res.data.objects[0].properties['appPersonalfile:pfnotice'].value;
        //         axios.post(UPDATE_URL, { 'appPersonalfile:pfnotice': `${notice}\n${msg}` }, {
        //             headers: {
        //                 'Authorization': `Bearer ${token}`,
        //                 'X-ID-TENANT-NAME': API.TENANT
        //             }
        //         }).then(res => {
        //             send(200, {})
        //         }).catch(err => send(500, err))
        //     }).catch(err => send(500, 'could not fatech notice'))




        // }).catch(err => send(401, err))
    }

    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            addNotice(body.objectId, body.msg);
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