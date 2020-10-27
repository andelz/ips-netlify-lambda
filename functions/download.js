const axios = require('axios');
const getAccessToken = require('utils').getAccessToken;
const API = require('utils').API;

exports.handler = async (event, context) => {

    console.log(event.body);
    
    if(event.httpMethod === 'POST'){
    const body = JSON.parse(event.body)

    const res = await axios.get(`${API.URL}/api-web/dms/${body.id}/content`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-ID-TENANT-NAME': API.TENANT
        }
    })

    const responsHeaders = {};
    responsHeaders['Access-Control-Allow-Origin'] = '*';
    responsHeaders['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, DELETE, PUT';
    responsHeaders['Access-Control-Allow-Headers'] = 'Origin, X-Requested-Width, Content-Type, Accept';
    // responsHeaders['Content-Disposition'] = `attachment; filename="${filename}"`;


    return {
        headers: responsHeaders,
        statusCode: res.status,
        body: res.data
    }} else {
        return {
            statusCode: 200,
            body: {}
        } 
    }
}

// exports.handler = function (event, context, callback) {

//     // send user response
//     const send = (status, body) => {
//         filename = 'lala'
//         const responsHeaders = {};
//         responsHeaders['Access-Control-Allow-Origin'] = '*';
//         responsHeaders['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, DELETE, PUT';
//         responsHeaders['Access-Control-Allow-Headers'] = 'Origin, X-Requested-Width, Content-Type, Accept';
//         responsHeaders['Content-Disposition'] = `attachment; filename="${filename}"`;

//         callback(null, {
//             statusCode: status,
//             headers: responsHeaders,
//             body: body
//         })
//     }

//     const download = (objectId) => {
//         getAccessToken(API.TENANT).then(res => {
//             const token = res.data.access_token;
//             console.log('token', !!token);
//             console.log(objectId);
//             return axios.get(`${API.URL}/api-web/dms/${objectId}/content`, q, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'X-ID-TENANT-NAME': API.TENANT
//                 }
//             })
//         }).then(res => {
//             send(200, res.data)
//         }).catch(err => {
//             console.log(err);
//             send(500, err)
//         })
//     }
// console.log('METHOD', event.httpMethod );
//     if (event.httpMethod === 'POST') {
//         try {
//             console.log('XXX', JSON.parse(event.body).id);
//             download(JSON.parse(event.body).id);
//         } catch (e) {
//             send(422, { dd: e })
//         }
//     }
//     else if (event.httpMethod === 'OPTIONS') {
//         send(200, {})
//     }
//     else {
//         send(422, { x: 'D' })
//     }
// }