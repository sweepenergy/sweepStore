const csv = require('csv-parse'); 
const fs = require('fs'); 

/*
var count = 0; 
fs.createReadStream('dummyData/test.csv')
    .pipe(csv())
    .on('data', (row) => {
        if(count == 0) {
            console.log('Column names:');
            console.log(row[0] + " " + row[1] + " " + row[2]); 
        }
        else {
            console.log(row); 
        }
        count++; 
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    }); 
*/

const Papa = require('papaparse');
const csvFilePath = 'dummyData/test.csv';
// Function to read csv which returns a promise so you can do async / await.

const readCSV = async (csvFilePath) => {
    //var csvDataa = [];
    const csvFile = fs.readFileSync(csvFilePath)
    const csvData = csvFile.toString()  
    return new Promise(resolve => {
        Papa.parse(csvData, {
        header: true,
        //step: function(result) {
            //csvDataa = result.data; 
        //},
        complete: results => {
            console.log('Complete', results.data.length, 'records.'); 
            resolve(results.data); 
            csvDataa = result.data;
            //console.log(results); 
            //console.log("Column names: " + results.meta.fields); 
        }
        });
    });
};
//console.log(csvDataa); 

const test = async () => {
    var csvDataa = [];
    let parsedData = await readCSV(csvFilePath);
    console.log(csvDataa); 
}

test()
 
