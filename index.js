const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const rp = require('request-promise');
const dotenv = require('dotenv').config();
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let body = '';

app.use(bodyParser.urlencoded({extended: true}));

app.post('/', async (req, res) => {
    // Get sourceUrl (actual file url) from req.body
    var imageUrl = req.body.sourceUrl;
    var caption = req.body.caption || '';
    
    // End the request since we got the image url & caption
    res.status(200).end();

    // Download image in base64 encoded string format
    console.log('Getting base64 image');
    getBase64Image(imageUrl).then((base64Image) => {
      // Send base64 string to Truface to see if it recognizes me
      console.log('Sending base64 image to TrueFace to check match');

      checkIfMatch(base64Image).then((resp) => {
        console.log('Handling return from TrueFace');
        
        // Send SMS with image if it's me
        if(resp.success && resp.data[0].emb0_match){
          console.log('Sending SMS');

          sendSMS(twilio, imageUrl, caption).then(message => {
            console.log('SMS sent successfully');
          }).catch((e) => {
            console.log('Error sending SMS:',e);
          });
        } else {
          console.log('Either TrueFace was not successful or picture was not a match. Finishing.');
        }
      })
    }).catch((err) => {
      console.log('Error:',err);
    });
});

function getBase64Image(url){
    return new Promise((resolve, reject) => {
      https.get(url, (resp) => {
          if (resp.statusCode < 200 || resp.statusCode > 299) {
            reject(new Error('Unexpected response from Instagram, status code: ' + resp.statusCode));
          }
          resp.setEncoding('base64');
          resp.on('data', (data) => { body += data});
          resp.on('end', () => {
              resolve(body);
          });
      }).on('error', (e) => {
          reject(new Error('Error getting response from Instagram: ' + e));
      });
    });
}

function checkIfMatch(base64Image){
  var options = {
      method: 'POST',
      uri: 'https://api.chui.ai/v1/match',
      headers: {
          'x-api-key': process.env.TRUEFACE_API_KEY,
          'Content-Type': 'application/json',
      },        
      body: {
          id: "ahBzfmNodWlzcGRldGVjdG9ychcLEgpFbnJvbGxtZW50GICAgNiMkYcJDA",
          img: base64Image
      },
      json: true // Automatically stringifies the body to JSON
  };
   
  return rp(options).catch((e) => {
    console.log('Error making request to TrueFace:',e);
  });
}

function sendSMS(client, imageUrl, caption){
  return client.messages
    .create({
      body: caption,
      to: `+${process.env.DEST_NUM}`,
      from: '+12019480335',
      mediaUrl: imageUrl,
    });
}

app.listen(process.env.PORT, () => console.log('Hack Kean demo app is alive!'))