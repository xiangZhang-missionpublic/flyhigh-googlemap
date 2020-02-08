

function getParams(req) {
    let params = {};
    if (req.body) {
        params = Object.assign(params, req.body);
    }
    if (req.query) {
        params = Object.assign(params, req.query);
    }
    if (req.params) {
        params = Object.assign(params, req.params);
    }
    return params;
}


module.exports = {
    getParams: getParams
};