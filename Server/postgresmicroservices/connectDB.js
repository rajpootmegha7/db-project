// Function/Module Description: Connection to Postgres DB with URI

const {Pool} = require('pg')

const pool = new Pool({
    host:'localhost',
    user:'johndoe',
    password:'johndoe',
    max:20,
    database:'liquorstore',
    idleTimeoutMillis:30000,
    connectionTimeoutMillis: 2000
})

module.exports = pool