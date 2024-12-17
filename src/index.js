const express = require('express');
const cors = require('cors');
const globalErrorHandler = require('./controllers/ErrorController');
const CustomError = require('./utils/CustomError');
const { PORT } = require('./db/config')


const app = express();

app.use(cors());
app.use(express.json({limit: '5mb'}));

const conn = require('./db/conn');

app.get('/', (req, res) => {
    res.send('Hello user')
})


const routes = require('./routes/router')

app.use('/api', routes);

app.all('*', (req, res, next) => {
    const err =  new CustomError(`Can't find ${req.originalUrl} on the server!`, 404)
    next(err);
})

app.use(globalErrorHandler)

conn()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server (${PORT}) is 🔥`)
        });    
    }).catch((err)=> {
        console.log("Erro na conexão com o mongo.");
        console.log(err);
    });


module.exports = app;