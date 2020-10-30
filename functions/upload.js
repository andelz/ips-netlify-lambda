
const getRequestOptions = require('utils').getRequestOptions;
const getResponseHeaders = require('utils').getResponseHeaders;
const toFile = require('data-uri-to-file');
var FormData = require('form-data');
const axios = require('axios');
var Buffer = require( "buffer" ).Buffer;
const API = require('utils').API;

exports.handler = function (event, context, callback) {

    console.log('headers', JSON.stringify(event.headers, null, 2))

    const respond = (status, body) => {
        callback(null, {
            statusCode: status,
            headers: getResponseHeaders(),
            ...(body && { body: JSON.stringify(body) })
        })
    }

    const upload = (objectId, filename) => {
        // console.log('upload ...', dataURL.length);
        let requestOptions;
        getRequestOptions(API.TENANT)
            // .then(options => {
            //     requestOptions = options;
            //     requestOptions.headers['Content-Disposition'] = `attachment; filename="${filename}"`
            //     // content-type: application/octet-stream
            //     // requestOptions.headers['Content-Type'] = `attachment; filename="${filename}"`
            //     return toFile(dataURL);
            // })
            .then(options => {
                requestOptions = options;
                requestOptions.headers['Content-Disposition'] = `attachment; filename="${filename}"`
                // requestOptions.headers['Content-Type'] = file.mimeType;
                const UPLOAD_URI = `${API.URL}/api-web/dms/update/${objectId}/content`;
                console.log('RO: ' + JSON.stringify(requestOptions)); 

                // const formData = new FormData();
                // formData.append('file', file);
                // requestOptions.headers = { ...requestOptions.headers, ...formData.getHeaders() }
                // return axios.post(UPLOAD_URI, formData, requestOptions);

                // console.log(JSON.stringify(requestOptions));
                console.log('BL: ' + event.body.length) 
                const uploadData = (event.body instanceof Buffer)
                    ? event.body : Buffer.from(event.body, (event.isBase64Encoded ? "base64" : "utf8"));

                // const f = new File([Uint8Array.from(uploadData).buffer], filename)

                return axios.post(UPLOAD_URI, uploadData, requestOptions);
            }).then(_ => {
                respond(200, {})
            }).catch(e => {
                // console.log('ERR', JSON.stringify(e))
                console.log('BX', e.message);
                respond(500, { error: e })
            });
    }

    if (event.httpMethod === 'POST') {
        try {
            // const body = JSON.parse(event.body);
            const { id, filename } = event.queryStringParameters;
            console.log(`UPLOAD got ID: ${id}, FILENAME: ${filename}`);
            if (!id) {
                respond(400, { message: 'Missing objectID' })
            } else {
                // respond(200);
                console.log('upl');
                upload(id, filename);
            }
        } catch (error) {
            // console.log(JSON.stringify(error, null, 2))
            console.log('EX');

            respond(500, { error: error });

        }
    } else if (event.httpMethod === 'OPTIONS') {
        respond(200, {})
    } else {
        respond(422, {})
    }
}
