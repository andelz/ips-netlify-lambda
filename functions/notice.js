const axios = require('axios');
const getRequestOptions = require('utils').getRequestOptions;
const getResponseHeaders = require('utils').getResponseHeaders;
const API = require('utils').API;


// add a notice
exports.handler = function (event, context, callback) {

    // send user response
    const send = (status, body) => {
        callback(null, {
            statusCode: status,
            headers: getResponseHeaders(),
            ...(body && { body: JSON.stringify(body) })
        })
    }

    const addNotice = (objectId, msg) => {

        const UPDATE_URL = `${API.URL}/api-web/dms/update/${objectId}`;
        const SEARCH_URL = `${API.URL}/api/dms/objects/search`;
        const NOTICE_FIELD = 'appPersonalfile:pfnotice';

        let requestOtions;

        getRequestOptions(API.TENANT).then(options => {
            requestOtions = options;
            // load the current notice
            const q = {
                "query": {
                    "statement": `select ${NOTICE_FIELD} from appPersonalfile:pfnoticesot where system:objectId='${objectId}'`
                }
            }
            return axios.post(SEARCH_URL, q, requestOtions)
        }).then(res => {
            const prop = res.data.objects[0].properties[NOTICE_FIELD];
            const data = {};
            data[NOTICE_FIELD] = `${prop ? prop.value : ''}\n${msg}`;
            return axios.patch(UPDATE_URL, data, requestOtions)
        }).then(res => {
            send(200, {})
        }).catch(err => {
            console.log(err);
            send(500, err)
        })
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