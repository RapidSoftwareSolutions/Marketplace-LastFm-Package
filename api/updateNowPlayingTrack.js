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
        sessionKey,
        secretKey,
        artist,
        track,
        album,
        context,
        mbid,
        albumArtist,
        trackNumber,
        duration
    } = req.body.args;
        
    let required = lib.parseReq({apiKey, sessionKey, secretKey, artist, track});

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

    let request = lib.clearArgs({
        artist,
        track,
        album,
        trackNumber,
        context,
        mbid,
        duration,
        albumArtist
    });
    
    lfm.track.updateNowPlaying(request, (err, scrobbles) => {
        if (err) defered.reject(err);   

        defered.resolve(scrobbles);
    });  

    return defered.promise;    
}