const Q       = require('q');
const md5     = require('md5');
const lib     = require('../lib');
const request = require('request');
const encode  = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));

module.exports = (req, res) => {
    const defered = Q.defer();

    req.body.args = lib.clearArgs(req.body.args);

    let { 
        apiKey,
        sessionKey,
        artist,
        track,
        timestamp,
        album,
        context,
        streamId,
        chosenByUser,
        trackNumber,
        mbid,
        albumArtist,
        duration
    } = req.body.args;
        
    let required = lib.parseReq({apiKey, sessionKey, artist, track, timestamp});

    if(required.length > 0) 
        throw new Object({
            status_code: 'REQUIRED_FIELDS', 
            status_msg:  'Please, check and fill in required fields.',
            fields: required
        });

    let uri = `method=track.scrobble&api_key=${apiKey}&sk=${sessionKey}`;

    uri += '&artist["0"]=' + encode(artist);
    uri += '&track["0"]=' + encode(track);
    uri += '&timestamp["0"]=' + timestamp;

    /*if(album)        uri += '&album[0]=' + encode(album);
    if(context)      uri += 'context[0]=' + encode(context);
    if(streamId)     uri += '&streamId[0]=' + streamId;
    if(chosenByUser) uri += '&chosenByUser[0]=' + chosenByUser;
    if(trackNumber)  uri += '&trackNumber[0]=' + trackNumber;
    if(mbid)         uri += '&mbid[0]=' + mbid;
    if(albumArtist)  uri += '&albumArtist[0]=' + encode(albumArtist);
    if(duration)     uri += '&duration[0]=' + duration;*/

    console.log(uri)

    request({
        uri: API_ROOT,
        body: uri,
        method: 'POST'
    }, (err, response, reslut) => {
        if(!err && (/20.*/).test(response.statusCode))  
            defered.resolve(lib.safeParse(reslut));
        else 
            defered.reject(lib.safeParse(err || reslut || response.statusCode));
    });

    return defered.promise;    
}