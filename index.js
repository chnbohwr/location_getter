const fs = require('fs');
const request = require('superagent');
const jsonfile = require('jsonfile');
const image_downloader = require('image-downloader');
const uuid = require('uuid');
const key = require('./key.json').key;
const config = require('./config.json');

function getList(){
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    function getListEnd(err, res){
        if (err) {
            console.log('error', err);
        } else {
            var results = res.body.results;
            writeJSON('list.json', results);
            results.forEach(function(result, index){
                getDetail(result.place_id);
            });
        }
    }
    request.get(url).query(config).query({key}).end(getListEnd);
}

function writeJSON(fileName, object){
    fs.mkdir('json', function(){
        var filePath = './json/' + fileName;
        jsonfile.writeFileSync(filePath, object);
    })
}

function writeImage(referenceId, uuid){
    console.log(referenceId);
    const url = `https://maps.googleapis.com/maps/api/place/photo?key=${key}&photoreference=${referenceId}&maxheight=500&maxwidth=500`;
    console.log(url);
    const dest = `./image/${uuid}.jpg`
    console.log(dest)
    const options = {
        url,
        dest,                  // Save to /path/to/dest/image.jpg
        done: function(err, filename, image) {
            if (err) {
                throw err;
            }
            console.log('File saved to', filename);
        },
    };
    fs.mkdir('image', function(){
        image_downloader(options);
    })
}

function getDetail(placeid){
    const url = 'https://maps.googleapis.com/maps/api/place/details/json';
    const parameter = {
        placeid,
        key,
        language: config.language
    };
    function getDetailEnd(err, res){
        if (err) {
            console.log('error', err);
        } else {
            var result = res.body.result;
            console.log(result.name);
            if(result.photos){
                var photoid = uuid.v4();
                var referenceId = result.photos[0].photo_reference;
                result.photos[0].url = `${photoid}.jpg`;
                writeImage(referenceId, photoid);
            }
            writeJSON(`${placeid}.json`, result);
        }
    }
    request.get(url).query(parameter).end(getDetailEnd)
}

getList();
