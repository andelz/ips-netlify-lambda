const axios = require('axios');
const qs = require('querystring');

exports.API = {
    TENANT: "kolibri",
    URL: "https://kolibri.enaioci.net"
}

exports.getAccessToken = (tenant) => {
    const { API_CLIENT_SECRET, API_USERNAME, API_PASSWORD } = process.env;


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
    })
}