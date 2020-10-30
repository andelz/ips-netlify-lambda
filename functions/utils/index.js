const axios = require('axios');
const qs = require('querystring');

exports.API = {
    TENANT: "kolibri",
    URL: "https://kolibri.enaioci.net"
}

exports.getResponseHeaders = () => {
    const responsHeaders = {};
    responsHeaders['Access-Control-Allow-Origin'] = '*';
    responsHeaders['Access-Control-Allow-Methods'] = 'PATCH, POST, GET, OPTIONS, DELETE, PUT';
    responsHeaders['Access-Control-Allow-Headers'] = 'Origin, X-Requested-Width, Content-Type, Accept';
    return responsHeaders
}

exports.getRequestOptions = (tenant) => {
    // const { API_CLIENT_SECRET, API_USERNAME, API_PASSWORD } = process.env;
    // console.log('TENANT', API.TENANT);
    // ----------------------
    const API_CLIENT_SECRET = "7587b0a4-20a3-45f2-b424-18bb4deae347";
    const API_USERNAME = "andreas";
    const API_PASSWORD = "optimalas"
    // ----------------------

    const AUTH_URL = `https://auth.enaioci.net/auth/realms/${tenant}/protocol/openid-connect/token`;
    return axios.post(AUTH_URL, qs.stringify({
        client_id: tenant,
        grant_type: 'password',
        client_secret: API_CLIENT_SECRET,
        scope: 'openid',
        username: API_USERNAME,
        password: API_PASSWORD,
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => Promise.resolve(
        {
            headers: {
                'Authorization': `Bearer ${res.data.access_token}`,
                'X-ID-TENANT-NAME': tenant
            }
        }
    ))
}