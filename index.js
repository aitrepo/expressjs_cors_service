var express = require('express')
var cors = require('cors')
const fs = require('fs');
const axios = require('axios');

var app = express()

app.use(cors())

let rawdata = fs.readFileSync('data.json');
let records = JSON.parse(rawdata);


app.get("/", function (REQUEST, reply, next) {

    // calling a API service using AXIOS lib.
    // use of promises (resolve/reject)
    let URI = "https://api.exchangeratesapi.io/latest?base=AUDTDJJD";
    callService(URI).then(data => {
        console.log(data);
        reply.send({ status: 200, data_: data.data })
    }).catch(e => {
        reply.send({ status: 500, data_: {} })
    });


});

// Service call 
function callService(URI) {
    return new Promise((resolve, reject) => {
        axios.get(URI)
            .then(function (response) {
                console.log(response);
                resolve(response);
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            });
    });
}

app.get('/booklist/:interest', function (req, reply, next) {

    if (req.params.interest != undefined) {

        let categories = req.params.interest.split(",");
        let finalResutl = {};

        if (categories != undefined && categories.length > 0) {

            categories.forEach(category => {
                finalResutl[category] = records[category];
            });
        }
        reply.send({ service: 'bookstore_v1', data: finalResutl })

    } else {
        reply.send({ service: 'bookstore_v1', data: records })
    }
})

app.get('/booklist/', function (req, reply, next) {
    reply.send({ service: 'bookstore_v1', data: records })
})

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})