const express = require('express');

const app = express();

app.listen(3000);

app.get('/', (req, res) => {
    res.send('Hello user')
})

app.use((req, res, next) => {
    console.log('Server is 🔥')
})