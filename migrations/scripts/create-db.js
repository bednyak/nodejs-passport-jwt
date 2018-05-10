const { Client } = require('pg');

const config = require('../../api/app/config');

const dbUser = config.database.user,
    dbPassword = config.database.password,
    dbHost = config.database.host,
    dbPort = config.database.port,
    dbName = config.database.name;

console.log(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/postgres`);

const CONNECTION_STRING = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/postgres`;
const client = new Client(CONNECTION_STRING);

client.connect();
client.query(`CREATE DATABASE ${dbName}`, () => {
    client.end();
});
