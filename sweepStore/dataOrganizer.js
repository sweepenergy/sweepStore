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


const path = require('path');
const csvPath = path.resolve(__dirname, './dummyData/test.csv')

const fs = require('fs');
const Papa = require('papaparse');
const fastcsv = require('fast-csv');
const writer = fs.createWriteStream("./dummydata/data.csv");

async function parse(csvFilePath) {
    const csvFile = fs.readFileSync(csvFilePath) //check if this lets you read in chunks
    const csvData = csvFile.toString()  
    return new Promise(resolve => {
        Papa.parse(csvData, {
        //check to import in chunks
        header: true,
        dynamicTyping: true,
        complete: results => {
            console.log('Complete', results.data.length, 'records.'); 

            let columnNames = results.meta.fields; 
            
            //Array of JSONs 
            let dataCSV = results.data; 
            resolve(dataCSV);
            //Size of dataCSV (Number of jsons/elements the array has has)
            let totSize = dataCSV.length;
            
            //Size of an individual json 
            let jsonSize = Object.keys(dataCSV[0]).length;
            
            // Here we can break the JSON object into an array
            var val = []; 
            let tempJson;
            for(let i = 0; i < columnNames.length; i++) {
                let colValues = [];
                colValues.push(columnNames[i]);
                for(let j = 0; j < totSize; j++) {
                    tempJson = dataCSV[j];
                    for (const [key, value] of Object.entries(tempJson)) {
                        if(key == columnNames[i]) {
                            colValues.push(value);
                        }
                    }
                }
                val.push(colValues);
            }
            //resolve(val);
        }
        });
    });
}

async function dataOrg() {
    //We currently have the tranpose of the dataset
    var data = await parse(csvPath);
    console.log(data);

    // data.foreach(element){
    //     dict[element] = json_decode(json_encode($a));
    // }

    // Lets us write to a file defined by ws
    // fastcsv
    //     .write(data, { headers: true })
    //     .pipe(writer);
    // console.log(data);
}

dataOrg();

//allows us to export the function as a module to be used by other files
module.exports = {dataOrg, parse};