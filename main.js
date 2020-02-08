const express = require('express');
const app = express();
const request = require("request");
const apiUtil = require("./util/ApiUtil.js");

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/googlemap', (req, res) => {

    let params = apiUtil.getParams(req);
    try {
        params.location = params.location.split(" ").join("%20");
        console.log(params.location);
        request.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?` +
            `input=${params.location || 'china%20dandong'}&inputtype=textquery&fields=formatted_address,name,geometry&v=3.exp&key=AIzaSyC8Q2WgAqeFLWOuY02PXuN80W6HNdK_S6I`,
            {json: true}, (err, resp, body) => {
                if (err) {
                    res.send(error);
                }
                console.log(body);
                res.send(body);
            });

    } catch (error) {
        res.send(error);
    }

});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
