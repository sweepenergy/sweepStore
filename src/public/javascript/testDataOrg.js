const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');

async function uploadParse(columns) {
    //console.log(columns); 
    //var str = JSON.stringify(columns); 
    //console.log(str); 

    for (const [key, value] of Object.entries(columns)) {
        console.log(`${key}: ${value}`);
    }

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
module.exports = {uploadParse};