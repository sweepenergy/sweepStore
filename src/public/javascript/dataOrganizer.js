const path = require('path');
const csvPath = path.resolve('../../public/cereal.csv');

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
            var dataset_result = [];
            for (let i in results.data) {
                let data = results.data[i];
                //fucntion that parses this row
                    //row parser is an async 
                var parseData = rowParser(data) 
                dataset_result.push(parseData) //<- techni. array of promises
                //use everyhting in rp
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
                           /*
                           error checking 
                           ordering may not always be the same
                           when you create a stream, return status and stream.id
                                stream.id refers to an alias (i.e. Wheaties honey gold)
                                    then we can check for existing parameters (stream.id.protein)
                                    
                            create stream => store Ts_Param in stream => 
                            could use its own thread
                           */ 
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
            //promise all()
            console.log("--------------Chunk end---------------"); 
        },
        complete: results => {
            console.log('Complete', results.data.length, 'records.'); 
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

module.exports = {dataOrg, parse};