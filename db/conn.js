const mongoose = require('mongoose');
const { mongoDBURL } = require('./config')

async function main() {
    try {
        await mongoose.connect(mongoDBURL);
        console.log("Conectado com o banco!")
    } catch (error) {
        console.log(`Erro: ${error}`)
    }
}

module.exports = main;