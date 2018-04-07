const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log(new Date().toLocaleDateString());
    res.status(200).send('Hello world');
})

app.listen(process.env.PORT, () => console.log('Hack Kean demo app is alive!'))