const Q       = require('q');
const md5     = require('md5');
const lib     = require('../lib');
const request = require('request');

module.exports = (req, res) => {
    const defered = Q.defer();

    req.body.args = lib.clearArgs(req.body.args);

    let { 
        apiKey,
        token,
        secretKey
    } = req.body.args;
        
    let required = lib.parseReq({apiKey, token, secretKey});

    if(required.length > 0) 
        throw new Object({
            status_code: 'REQUIRED_FIELDS', 
            status_msg:  'Please, check and fill in required fields.',
            fields: required
        });

    let apiSig = md5(`api_key${apiKey}methodauth.getSessiontoken${token}${secretKey}`);

    request({
        uri: API_ROOT,
        qs: {
            method: 'auth.getSession',
            token:   token,
            api_sig: apiSig,
            api_key: apiKey,
            format: 'json'
        },
        method: 'GET'
    }, (err, response, reslut) => {
        if(!err && (/20.*/).test(response.statusCode))  
            defered.resolve(lib.safeParse(reslut));
        else 
            defered.reject(lib.safeParse(err || reslut || response.statusCode));
    });

    return defered.promise;    
}