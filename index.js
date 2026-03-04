const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('hello from request api na jenkins ');

});



app.listen(3000, () => {
    console.log(" the server is running on port 3000");

});
