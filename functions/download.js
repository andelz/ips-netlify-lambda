const axios = require('axios');
const getRequestOptions = require('utils').getRequestOptions;
const getResponseHeaders = require('utils').getResponseHeaders;
const API = require('utils').API;

exports.handler = function (event, context, callback) {

    let filename = 'download';
    
    // send user response
    const send = (status, body) => {
        const responsHeaders = getResponseHeaders();
        responsHeaders['Access-Control-Allow-Headers'] = 'Content-Disposition, Origin, X-Requested-Width, Content-Type, Accept';
        responsHeaders['Content-Disposition'] = `attachment; filename="${filename}"`;

        callback(null, {
            statusCode: status,
            headers: responseHeaders,
            ...(body && { body })
        })
    }

    const download = (objectId) => {
        getRequestOptions(API.TENANT).then(options => {
            return axios.get(`${API.URL}/api-web/dms/${objectId}/content`, 
            {...options, responseType: 'arraybuffer'}
            
            // {
            //     responseType: 'arraybuffer',
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'X-ID-TENANT-NAME': API.TENANT
            //     }
            // }
            )
        }).then(res => {
            send(200, res.data)
        }).catch(err => {
            console.log(err);
            send(500, err)
        })
    }

    if (event.httpMethod === 'GET') {
        try {
            filename = event.queryStringParameters.name;
            download(event.queryStringParameters.id);
        } catch (e) {
            send(422, { dd: e })
        }
    }
    else if (event.httpMethod === 'OPTIONS') {
        send(200, null)
    }
    else {
        send(422, { x: 'D' })
    }
}