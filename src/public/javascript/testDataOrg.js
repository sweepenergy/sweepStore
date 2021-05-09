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

function postStreamData(streamID, ts_paramNames, ts_paramVals, timestampVal) {
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
    for(let i = 0; i < ts_paramNames.length; i++) {
        data = {
            "timestamp" : timestampVal,
            "sample" : ts_paramVals[i]
        }
        axios.post("https://api.sweepapi.com/stream/"+streamID+"/ts/"+ts_paramNames[i]+"/dataset", data, config_req)
        .then(function (response) {
            console.log("added data to stream: ", response.data); 
            //verifyDataOnStream(streamID, ts_param); 
        })
        .catch(function (error) {
            console.log(error); 
        });
    }
}

async function uploadParse(streamID, tsParams, timestampCol) {

    const csvFilePath = path.resolve('src/public/datasets/client_data.csv');
    const fileStream = fs.createReadStream(csvFilePath, {highWaterMark: 1024}); 
    
    let timestampVal; 
    let tsParamVals = []; 
    let tsParamNames = [];

    Papa.parse(fileStream, {
        header: true,
        dynamicTyping: true,
        step: function(results) {
            //console.log(results.data);
 
            for (const [keyVal, value] of Object.entries(results.data)) {
                if(keyVal == timestampCol) {
                    timestampVal = value; 
                }
                else if(tsParams.includes(keyVal)) {
                    tsParamVals.push(value); 
                    tsParamNames.push(keyVal); 
                }
            }

            /* console.log("row: ", rownum); 
            for(let i = 0; i < tsParamNames.length; i++) {
                console.log("tsparam: ", tsParamNames[i], "value: ", tsParamVals[i]); 
            }  */

            postStreamData(streamID, tsParamNames, tsParamVals, timestampVal)
            tsParamVals = [];
            tsParamNames = []; 
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

async function parseTest() {
    const csvFilePath = path.resolve('src/public/datasets/test.csv');
    const fileStream = fs.createReadStream(csvFilePath, {highWaterMark: 1024}); 

    Papa.parse(fileStream, {
        header: true,
        dynamicTyping: true,
        step: function(results) {
            //console.log(results.data);

            let timestampVal; 
            let tsParamVal; 
            let tsParamName; 
            for (const [keyVal, value] of Object.entries(results.data)) {
                timestampVal = " "; 
                tsParamVal = " "; 

                if(keyVal == timestampCol) {
                    timestampVal = value; 
                }
                else if(ts.includes(keyVal)) {
                    tsParamVal = value; 
                    tsParamName = keyVal; 
                }

                //Check that both have been filled. Some columns could be 'not applicable' 
                if(timestampVal != " " && tsParamVal != " ") {
                    //postStreamData(streamID, tsParamName, tsParamVal, timestampVal)
                }
                //console.log(`${keyVal}: ${value}`);
            } 
        }, 
        /*
        chunk: function(results, parse) {

            for (let i = 0; i < results.data.length; i++) {
                for (const [keyVal, value] of Object.entries(results.data[i])) {
                    if(ts.includes(keyVal)) {

                    }
                    console.log(`${keyVal}: ${value}`);
                }
            }

            //results.data is an array of json objects 
            //console.log("Chunk data:", results.data[0]); 
            console.log("--------------Chunk end---------------"); 
        },
        */ 
        complete: results => {
            
        }
    }); 
}

//parseTest(); 

//allows us to export the function as a module to be used by other files
module.exports = {getColumns};