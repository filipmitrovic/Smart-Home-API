const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');
let SSE = require('express-sse');
let sse = new SSE();
const adapter = new FileSync('./db/db.json')
const db = low(adapter)

function update() {
    return new Promise((resolve, reject) => {
        let devices = db.get('devices').value();
        sse.send({ devices: devices });
        resolve()
        console.log('Update sent')
    })
}

module.exports = { db, sse, update }

