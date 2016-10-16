const fs = require('fs');
const request = require('superagent');
const jsonfile = require('jsonfile');
const key = require('./key.json').key;
const config = require('./config.json');

function queryList(){
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    function queryListEnd(err, res){
        if (err) {
            console.log('error', err);
        } else {
            var result = res.body;
            console.log(res);
            writeJSON('list.json', result);
        }
    }
    request.get(url).query(config).query({key}).end(queryListEnd);
}

function writeJSON(fileName, object){
    fs.mkdir('json', function(){
        var filePath = './json/' + fileName;
        jsonfile.writeFileSync(filePath, object);
    })
}

queryList();
