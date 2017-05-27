const config = require('config');
config['knex'].connection = process.env.DATABASE_URL;
module.exports = config['knex'];
