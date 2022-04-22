module.exports = (request, response, next) => { 
    if( typeof request.body != 'undefined') {
        let saveBody = request.body;
        request.body = {};
        Object.keys(saveBody).forEach((key) => {
            if(typeof key != 'undefined' && key.indexOf('[') != -1 && key.indexOf(']') != -1) {
                let newKey = key.replace(']', '').split('[');
                if(typeof request.body[newKey[0]] == 'undefined') {
                    request.body[newKey[0]] = {};
                }
                request.body[newKey[0]][newKey[1]] = saveBody[key];
            } else {
                request.body[key] = saveBody[key];
            }
        });
    }
    next();
}
