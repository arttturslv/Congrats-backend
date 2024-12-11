const dotenv = require('dotenv');

dotenv.config();

const PORT = 3000;
const mongoDBURL = process.env.URLMONGO;


module.exports = {
    PORT,
    mongoDBURL
}