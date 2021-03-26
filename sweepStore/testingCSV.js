const csv = require('csv-parse'); 
const fs = require('fs'); 

const Papa = require('papaparse');
const csvFilePath = 'dummyData/cereal.csv';
// Function to read csv which returns a promise so you can do async / await.

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
            for(let i = 0; i < totSize; i++) {
                tempJson = dataCSV[i]; 
                for (const [key, value] of Object.entries(tempJson)) {
                    if(key == columnNames[j]) {
                        val.push(tempJson[key]);
                    }
                        //console.log(key, value);
                        //console.log(tempJson[key]);   
                }
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
    let parsedData = await readCSV(csvFilePath); 
}

test()
 
