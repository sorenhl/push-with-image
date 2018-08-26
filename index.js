
// Example:
// http://localhost:3000/picture?pushSaferKey=xxxxxxxx&message=PIR%20bevægelse%20ved%20bagdøren&pictureUrl=http%3A%2F%2Fadmin%3Axxxxxxx%40192.168.1.64%2FISAPI%2FStreaming%2Fchannels%2F101%2Fpicture
// docker build -t sorenhl/push-with-image .
// docker tag e01d7b9ee054 coki.heidelarsen.dk:32797/push-with-image:latest
// docker push coki.heidelarsen.dk:32797/push-with-image:latest
const express = require('express')
const app = express()
var request = require('request').defaults({ encoding: null });

app.get('/picture', (req, res) => {
    let pictureUrl = req.query.pictureUrl;
    let pushsaferKey = req.query.pushSaferKey;
    let message = req.query.message;
    
    if(!pictureUrl || !pushsaferKey || !message) {
        res.send('Must specify pictureUrl,pushSaferKey,message in query');
        reurn;
    }
    var push = require( 'pushsafer-notifications' );
    var p = new push( {
        k: pushsaferKey,
        debug: false
    });

    
    request.get(pictureUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let data = "data:" + response.headers["content-type"].split(';')[0] + ";base64," + new Buffer(body).toString('base64');
            console.log(data);

            var msg = {
                m: message,
                p: data
            };
            p.send( msg, function( err, result ) {
                //console.log( 'ERROR:', err ); 
                console.log( 'RESULT', result );
                // process.exit(0); 
                if(err) {
                    res.send(err);
                } else {
                    res.send('OK');
                }
            });
        } else {
            res.send('Error');
        }
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))





 
