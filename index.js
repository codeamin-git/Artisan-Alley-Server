const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express());

app.get('/', (req, res)=>{
    res.send('Arts & Crafts server side running')
})

app.listen(port, ()=>{
    console.log('Arts & Crafts running on port: ', port)
})