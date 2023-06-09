const crypto = require('crypto');

function getSignature(parameters, secret) {
    var orderedParams = "";
    Object.keys(parameters).sort().forEach(function (key) {
        orderedParams += key + "=" + parameters[key] + "&";
    });
   
    orderedParams = orderedParams.substring(0, orderedParams.length - 1);
    
    return crypto.createHmac('sha256', secret).update(orderedParams).digest('hex');
}

module.exports = getSignature;