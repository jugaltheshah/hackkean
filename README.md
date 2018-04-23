# Hack Kean Demo

This is an IFTTT webhook endpoint that runs every new Instagram post through the TrueFace facial recognition API. If my face is recognized in an image, it sends the image off as an MMS using the Twilio API.

## Prerequesites

1) An IFTTT webhook that fires off a POST request for every Instagram picture posted
2) TrueFace API key + an instance trained on your face
3) Twilio API key

## Entry point

Look at index.js (or asyncAwaitIndex.js for async/await version) - this is the webhook logic.

## Hosting

Given the myriad possibilities for hosting, it is out of the scope of this document to discuss which to use. Some free possibilities though are Webtask.io & Heroku. You would take the public URL given by those services and create the IFTTT webhook.