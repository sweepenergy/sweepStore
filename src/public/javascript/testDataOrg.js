const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

const axios = require('axios'); 

function createDirectory(dirName) { 
    //Global variables from server
    //console.log("key: ", key); 
    //console.log("token: ", token); 

    config_req = { 
        auth: {
            username: key,
            password: token
        },
        headers: {
            "Content-Type": "application/json"
        }
    },
    data = {
        "name": dirName
    }
    axios.post("https://api.sweepapi.com/directory", data, config_req)
    .then(function (response) {
        console.log("directory: ", response.data);  
        return response.data["id"]; 
    })
    .catch(function (error) {
        console.log(error); 
    }); 
}

function getColumns(columns) {
    let dirID; 
    let dirName;
    let stream; 
    let timestamp; 
    let ts_params = []; 

    for (const [key, value] of Object.entries(columns)) {
        //console.log(`${key}: ${value}`);

        //Storing the names of the columns that represent these 
        if(value == 'directory') {
            dirName = key; 
        }

        if(value == 'stream') {
            stream = key; 
        }

        if(value == 'timestamp') {
            timestamp = key; 
        }

        if(value == 'ts_params') {
            ts_params.push(value); 
        }
    }
    dirID = createDirectory(dirName);
    uploadParse(); 
}

async function uploadParse() {
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