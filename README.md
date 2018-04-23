# Hack Kean Demo

This is an IFTTT webhook endpoint that runs every new Instagram post through the TrueFace facial recognition API. If my face is recognized in an image, it sends the image off as an MMS using the Twilio API.

## Prerequesites

1) An IFTTT webhook that fires off a POST event for every Instagram picture
2) TrueFace API key
3) Twilio API key

## Hosting

Given the myriad possibilities for hosting, it is out of the scope of this document. Some free possibilities though are Webtask.io & Heroku. You would take the public URL given by those services and create an IFTTT webhook.

