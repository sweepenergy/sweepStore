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



//console.time()
const path = require('path')
const dbPath = path.resolve(__dirname, './dummyData/test.csv')
const parser = require('csv-parse');
const fs = require('fs');
const { delimiter } = require('path');
const csvData = [];

fs.createReadStream(dbPath)
    .pipe(parser({
        columns: true
    }))
    .on('data', function(data) {
        csvData.push(data);
    })
    .on('end', function() {
        console.log("Length of CSV: ", csvData.length);
        console.log(csvData);
    });

//console.timeEnd()



// var fs = require('fs');
//var csv = require('csv')
// var parse = require('csv-parse');

// var data = fs.createReadStream(dbPath);
//This should be creating an object literal where: parser = {colName 1 = {data}, ..., colName N = {data}}
// var parser = parse({columns: true}, function (err, records) {
// 	console.log(records);
// });

// var result = fs.createReadWriteStream(dbPath).pipe(parser);

// var columnResults = {};

// console.log("result Length: ", result);
// for(var row = 0; row < parser.length; row++) {
//     console.log("1");
//     for(var col in parser[row]) {
//         if(!columnparsers[col]) {
//             console.log("2");
//             columnparsers[col] = [];
//         }
//         console.log("3");
//         columnResults[col].push(parser[row][col]); 
//     }
// }

// console.log("Number of columns:", Object.keys(columnResults).length);
// console.log("Column names:", Object.keys(columnResults));
// console.log("Column data:", columnResults);

