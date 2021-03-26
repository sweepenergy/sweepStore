/*  
    --- WHAT NEEDS TO BE DONE ---
    1. We can create a dummy dataset to simulate our fucntions on
    2. Our function(s) must be able to reorganize columns (maybe rows) 
        *This information should be sent back to the visualViewer function so that the GUI can correctly display the DB file structure
    3. How do we store the data?
        -We can use an ordered 2D-array to iteratively make post requests
            >This data is what will be used in the post requests when generating new folders and passing information
            >The first set of [] could indicate the folder name 
            >The second set of [] would be the stream data containing all the col/row information
                                         Tree[]
                     WeatherStation1[] <-|    |-> WeatherStation2[]
                      /       |      \          /       |      \
                   Health    Temp   Speed    Health    Temp   Speed            <-- The last level of information would be stream data
*/


const path = require('path')
const csvPath = path.resolve(__dirname, './dummyData/test.csv')
const parser = require('csv-parse');
const fs = require('fs');
const Papa = require('papaparse');

const readCSV = async (csvFilePath) => {
    const csvFile = fs.readFileSync(csvFilePath)
    const csvData = csvFile.toString()  
    return new Promise(resolve => {
        Papa.parse(csvData, {
        header: true,
        complete: results => {
            console.log('Complete', results.data.length, 'records.'); 
            resolve(results.data); 
            //console.log(results); 

            let columnNames = results.meta.fields; 
            // console.log(columnNames); 
            
            //Array of JSONs 
            let dataCSV = results.data; 
            //console.log(dataCSV[0]); 
            
            //Size of dataCSV (Number of jsons/elements the array has has)
            let totSize = dataCSV.length;
            //console.log(totSize);
            //Size of an individual json 
            let jsonSize = Object.keys(dataCSV[0]).length;
            //console.log(jsonSize); 
            
            var val = []; 
            let tempJson;
            for(let i = 0; i < columnNames.length; i++) {
                let colValues = [];
                colValues.push(columnNames[i]);
                for(let j = 0; j < totSize; j++) {
                    tempJson = dataCSV[j]; 
                    for (const [key, value] of Object.entries(tempJson)) {
                        if(key == columnNames[i]) {
                            colValues.push(tempJson[key]);
                        }
                        //console.log(key, value);
                        //console.log(tempJson[key]);   
                    }
                }
                val.push(colValues);
            }
            console.log(val); 

            // let firstCol = ['name']; 
            // for(let i = 0; i < totSize; i++) {
            //     firstCol.push(dataCSV[i].name); 
            // }

            // console.log(firstCol)
        }
        });
    });
}; 

const test = async () => {
    var data = await readCSV(csvPath);
    //console.log("Data: \n", data);
}

test() 