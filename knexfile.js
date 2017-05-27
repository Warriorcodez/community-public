const config = require('config');
const env = require('dotenv').config();
config['knex'].connection = process.env.DATABASE_URL;
module.exports = config['knex'];
