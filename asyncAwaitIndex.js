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
    const base64Image = await getBase64Image(imageUrl);

    console.log('Checking if image is a match');
    const faceRecognized = await checkIfMatch(base64Image).then(resp => (resp.success && resp.data[0].emb0_match));


    if(faceRecognized){
        console.log('Match was found, sending image as SMS');
        sendSMS(imageUrl, caption);
    }
});

async function getBase64Image(url){
    return new Promise((resolve, reject) => {
      https.get(url, (resp) => {
          if (resp.statusCode < 200 || resp.statusCode > 299) {
            reject(new Error('Failed to load page, status code: ' + resp.statusCode));
          }
          resp.setEncoding('base64');
          resp.on('data', (data) => { body += data});
          resp.on('end', () => {
              resolve(body);
          });
      }).on('error', (e) => {
          reject(new Error('Failed to load page, status code: ' + response.statusCode));
      });
    });
}

async function checkIfMatch(base64Image){
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

async function sendSMS(imageUrl, caption){
  return twilio.messages
    .create({
      body: caption,
      to: `${process.env.DEST_NUM}`,
      from: '+12019480335',
      mediaUrl: imageUrl,
    });
}

app.listen(process.env.PORT, () => console.log('Hack Kean demo app is alive!'))