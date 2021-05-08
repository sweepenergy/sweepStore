const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

const axios = require('axios'); 

function createDirectory(dirName) { 
    config_req = { 
        auth: {
            username: key,
            password: token
        },
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        }
    },
    data = {
        "name": dirName
    }
    return axios.post("https://api.sweepapi.com/directory", data, config_req).then(response => {return response.data["id"]});  
}

function createStream(directoryID, streamName, inputDataVar) {
    config_req = {
        auth: {
            username: key,
            password: token
        },
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*"
        }
    }
    data = {
        "directory_id": directoryID,
        "name": streamName,
        "inputDataVar": inputDataVar
    }
    return axios.post("https://api.sweepapi.com/stream", data, config_req).then(response => {return response.data["stream_id"]});
}


function getColumns(columns) { 
    let dirID; 
    let streamID; 
    let stream;  
    let timestamp; 
    let ts_params = []; 

    for (const [key, value] of Object.entries(columns)) {
        //console.log(`${key}: ${value}`);

        //Storing the names of the columns that represent these 
        if(value == 'directory') { 
            dirID = createDirectory(key); 
        }

        if(value == 'stream') {
            stream = key; 
        }

        if(value == 'timestamp') {
            timestamp = key; 
        }

        if(value == 'ts_param') {
            ts_params.push(key); 
        }
    }

    let inputDataVar = []; 
    ts_params.forEach(function(item, index, array) {
        inputDataVar.push({
            "var_name": item,
            "display_name": item,
            "type": "number"
        })
    })

    dirID.then(function(result) {
        console.log("dir id ", result); 
        streamID = createStream(result, stream, inputDataVar);

        streamID.then(function(result) {
            console.log("stream id ", result); 
            uploadParse(result, ts_params, timestamp); 
        })
    })

}

async function uploadParse(streamID, tsParams, timestampCol) {
    console.log("up sID ", streamID);

    const csvFilePath = path.resolve('src/public/datasets/client_data.csv');
    const fileStream = fs.createReadStream(csvFilePath, {highWaterMark: 1024}); 
     
    Papa.parse(fileStream, {
        header: true,
        dynamicTyping: true,
        chunk: function(results, parse) {
            //results.data is an array
            //console.log("Chunk data:", results.data); 
            //console.log("--------------Chunk end---------------"); 
        },
        complete: results => {
            //console.log('Complete', results.data.length, 'records.'); 

            //let columnNames = results.meta.fields; 

            ////Array of JSONs 
            //let dataCSV = results.data; 
            ////resolve(dataCSV);
    
            ////Size of dataCSV (Number of jsons/elements the array has has)
            //let totSize = dataCSV.length;
            //
            ////Size of an individual json 
            //let jsonSize = Object.keys(dataCSV[0]).length;
            //
            //var val = []; 
            //let tempJson;
            //for(let i = 0; i < columnNames.length; i++) {
            //    let colValues = [];
            //    colValues.push(columnNames[i]);
            //    for(let j = 0; j < totSize; j++) {
            //        tempJson = dataCSV[j];
            //        for (const [key, value] of Object.entries(tempJson)) {
            //            if(key == columnNames[i]) {
            //                colValues.push(value);
            //            }
            //        }
            //    }
            //    val.push(colValues);
            //}
            //resolve(val);
        }
    }); 

    //deleting the file
    const uploadedFile = 'src/public/datasets/client_data.csv'; 
    fs.unlink(uploadedFile, (err) => {
        if (err) {
          console.error(err)
          return
        }
      
        //file removed
      })

}

//allows us to export the function as a module to be used by other files
module.exports = {getColumns};