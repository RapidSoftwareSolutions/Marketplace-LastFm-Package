const Q         = require('q');
const md5       = require('md5');
const lib       = require('../lib');
const request   = require('request');
const LastfmAPI = require('lastfmapi');

module.exports = (req, res) => {
    const defered = Q.defer();

    req.body.args = lib.clearArgs(req.body.args);

    let { 
        apiKey,
        secretKey,
        sessionKey,
        scrobbleData
    } = req.body.args;
        
    let required = lib.parseReq({apiKey, sessionKey, secretKey, scrobbleData});

    if(required.length > 0) 
        throw new Object({
            status_code: 'REQUIRED_FIELDS', 
            status_msg:  'Please, check and fill in required fields.',
            fields: required
        });

    var lfm = new LastfmAPI({
        'api_key': apiKey,
        'secret':  secretKey
    });

    lfm.setSessionCredentials('', sessionKey);  

    try {
        if(!Array.isArray(scrobbleData))
            scrobbleData = JSON.parse(scrobbleData);
    } catch(e) {
        throw new Object({
            status_code: 'JSON_VALIDATION', 
            status_msg:  'Syntax error. Incorrect input JSON. Please, check fields with JSON input.'
        });
    }
    
    lfm.track.scrobble(scrobbleData, (err, scrobbles) => {
        if (err) defered.reject(err);

        defered.resolve(scrobbles);
    });  

    return defered.promise;    
}