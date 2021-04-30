const FileSync = require('lowdb/adapters/FileSync');
const { app } = require('./core'); 
const { db, update } = require('./db');

app.listen(3000, () => {
    console.log('API for smart home 1.1 up n running.');
})

/* CODE YOUR API HERE */

/*
    Use this URL query structure:
    localhost:3000/category/deviceID?&query1=val&query2=val
    example: /light/lig1?&on=true&brightness=0.4&color=000

    NOTE: no error handling is done
*/

const convertStrToBool = str => {
    if (str === 'true') {
        return true;
    } else if (str === 'false') {
        return false;
    } else { return undefined }
}

app.get('/*/:id', (req, res) => {
    const categoryPath = req.path.split('/')[1];
    // add error handling here to check for an invalid category...
    const deviceID = req.params.id.toUpperCase(); // getting the device ID that we are going to need later
    // below we are saving our queries that we are going to loop through later
    const queriesValues = Object.values(req.query); 
    const queriesKeys = Object.keys(req.query);

    let devices = db.get('devices'); // we get the devices from the database
    let device = devices.find({ id : deviceID }); // we are finding a matching device with its query ID
    // add error handling here to check for an invalid id...

    // looping through the queries and depending on query values it's assigning different operations to the device
    for (let i = 0; i < queriesKeys.length; i++) {
        let key = queriesKeys[i].toLowerCase();
        let value = queriesValues[i].toLowerCase();

        // we need to manipulate query input values for certain queries
        // we add/convert the values to make sure the assignment works for all queries
        if (key === 'on') value = convertStrToBool(value);
        if (key === 'color') value = '#'+value;

        device.assign({ [key]: value }).value(); // assigning an operation for the device
    }
    update(); // tell frontend to update state
    res.send('done');
})