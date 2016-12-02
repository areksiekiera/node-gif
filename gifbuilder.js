'use strict';

var im = require('imagemagick');
var aws = require('aws-sdk');
var fs = require('fs');

// aws config
var config = require('./config')
aws.config.update(config.aws);

var s3 = new aws.S3();

const s3_uri = 'https://s3-us-west-2.amazonaws.com/com.rma99.lights/'

// build gif 
function build_gif(msg, callback){

    // trim message
    msg = msg.trim();

    // start command
    var command = ['-delay', '50', 'img_png/off.png', '-delay', '50', 'img_png/on.png', '-delay', '50', 'img_png/off.png']; 
    var gif_filename = '/tmp/';

    var space = ['-delay', '20', 'img_png/off.png'];


    // add chars one by one and build gif name
    var last_char = '9'
    for (var i = 0, len = msg.length; i < len; i++) {
        var lc = msg[i].toLowerCase();
        
        if (last_char == lc){
            command = command.concat(space);
        }
        last_char = lc;

        if (lc.match(/[a-z]/i)){
            command = command.concat(['-delay', '75', 'img_png/'+lc+'.png']);
            gif_filename += lc;
        }
        else{
            command = command.concat(space);
            gif_filename += '_';
        }
    }

    gif_filename += '.gif';

    command.push(gif_filename);

    // convert
    im.convert(command, 
        function(err, stdout){

            fs.readFile(gif_filename, function (err, data) {
                if (err) throw err; // Something went wrong!

                var s3_filename = parseInt(+ new Date()) +"_"+ msg.toLowerCase().replace(" ", "_") +'.gif';
            
                // filename & body
                var params = {
                    Bucket: 'com.rma99.lights',
                    Key: s3_filename,
                    Body: data,
                    ContentType: 'image/gif'
                };

                s3.putObject(params, function (err, pres) {

                    // Whether there is an error or not, delete the temp file
                    fs.unlink(gif_filename, function (err) {
                        if (err) {
                            console.error(err);
                        }
                        console.log('Temp File Delete');
                    });

                    if (err) {
                        console.log("Error uploading data: ", err);
                        callback(err);
                    } else {
                        console.log("Successfully uploaded gif: ", s3_uri + s3_filename);
                        callback(false, {'uri': s3_uri + s3_filename});
                    }
                });

                
            });


        });


}


module.exports.build = function(message, callback){
    
    // build gif
    build_gif(message, function (err, data) {
        if (err) throw err;

        callback(false, { 'uri': data['uri'] });
    });
    
};
