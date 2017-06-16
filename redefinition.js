var datetime = require('node-datetime');

var override = function(args) {

    if(args.timestamp != undefined && isNaN(args.timestamp)){
        var dateTimeObj = datetime.create(args.timestamp);
        args.timestamp = dateTimeObj.epoch().toString();
    }

    if(args.startTimestamp != undefined && isNaN(args.startTimestamp)){
        var dateTimeObj = datetime.create(args.startTimestamp);
        args.startTimestamp = dateTimeObj.epoch().toString();
    }

    if(args.endTimestamp != undefined && isNaN(args.endTimestamp)){
        var dateTimeObj = datetime.create(args.endTimestamp);
        args.endTimestamp = dateTimeObj.epoch().toString();
    }

    if(args.from != undefined && isNaN(args.from)){
        var dateTimeObj = datetime.create(args.from);
        args.from = dateTimeObj.epoch().toString();
    }

    if(args.to != undefined && isNaN(args.to)){
        var dateTimeObj = datetime.create(args.to);
        args.to = dateTimeObj.epoch().toString();
    }

    return args;
};
module.exports.override = override;