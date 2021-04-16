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
const csvPath = path.resolve('../public/cereal.csv');

const fs = require('fs');
const Papa = require('papaparse');
const fastcsv = require('fast-csv');
//const writer = fs.createWriteStream("./dummydata/data.csv");

async function parse(csvFilePath, columnFields) {
    //const csvFile = fs.readFileSync(csvFilePath)
    //const csvData = csvFile.toString() 
    const fileStream = fs.createReadStream(csvFilePath, {highWaterMark: 1024}); 
     
    Papa.parse(fileStream, {
        header: true,
        dynamicTyping: true,
        chunk: function(results, parse) {
            //results.data is an array
            console.log("Chunk data:", results.data); 
            //console.log(fileStream.readableHighWaterMark);

            for (let i in results.data) {
                let data = results.data[i];
                //console.log("data: ", data);
                for (let key in data) {
                    //console.log("Result Key: ", key);
                    for (let col in columnFields) { 
                        //console.log("Col Key: ", col);  
                        if (col == key) {
                            /*
                            When the the keys match then we can initiate a post request with the correct type
                                i.e. dir, stream, ts_param
                            */
                           field = columnFields[col];
                           switch(field) {
                               case "Dir":
                                   /*
                                   We need to check if the directory already exist
                                        if so, do nothing and move? into the correct directory
                                   */
                                   console.log("Post a directory!");
                                   break;
                                case "Stream":
                                    /*
                                    Post to the correct directory
                                    */ 
                                    console.log("Post a stream!");
                                    break;
                                case "Ts_Param":
                                      /*
                                    Post to the correct stream?
                                    */ 
                                    console.log("Post a ts_param!");
                                    break;
                           }
                        }
                    }
                }
            }
            console.log("--------------Chunk end---------------"); 
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
}

function test(csvFilePath) {
    const csvData = fs.createReadStream(csvFilePath, {highWaterMark: 1000});

    var data=[];
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      step: function(result) {
        data.push(result.data)
        console.log("result: ", result.data);
        console.log("---------Chunk end-----------"); 
      },
      complete: function(results, file) {
        console.log('Complete', data.length, 'records.'); 
      }
    });
}


async function dataOrg(columnFields) {

    var data = await parse(csvPath, columnFields);


    //console.log(data);
    // data.foreach(element){
    //     dict[element] = json_decode(json_encode($a));
    // }
    //Lets us write to a file defined by ws
    //fastcsv
    //.write(data, { headers: true })
    //.pipe(writer);
    //console.log(data);
}

// columnFields = {index : "Dir",
//                 word : "Stream",
//                 type : "Ts_Param"};

columnFields = {name : "Dir",
                mfr : "Stream",
                type : "Ts_Param",
                calories : "Ts_Param",
                protein : "Ts_Param",
                fat : "Ts_Param",
                sodium : "Stream",
                fiber : "Stream",
                carbo : "Stream",
                sugars : "Stream",
                potass : "Ts_Param",
                vitamins : "Ts_Param",
                shelf : "Stream",
                weight : "Stream",
                cups : "Ts_Param",
                rating : "Stream"};

dataOrg(columnFields); 

//allows us to export the function as a module to be used by other files
module.exports = {dataOrg, parse};