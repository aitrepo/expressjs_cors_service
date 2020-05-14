var express = require('express')
var cors = require('cors')
const fs = require('fs');

var app = express()

app.use(cors())

let rawdata = fs.readFileSync('data.json');
let records = JSON.parse(rawdata);


app.get("/",function(req,reply,next){
    reply.send("Hello");
});

app.get('/booklist/:interest', function (req, reply, next) {
  
    if(req.params.interest != undefined){

        let categories = req.params.interest.split(",");
        let finalResutl ={};

        if(categories !=undefined && categories.length >0){

            categories.forEach(category => {
                finalResutl [category]=records[category];                
            });
        }
        reply.send({ service: 'bookstore_v1', data:finalResutl})

    }else{
            reply.send({ service: 'bookstore_v1', data: records })
    }
})

app.get('/booklist/', function (req, reply, next) {
    reply.send({ service: 'bookstore_v1', data: records })
  })

app.listen(3000, function () {
  console.log('CORS-enabled web server listening on port 3000')
})