const axios = require('axios');
const btoa = require('btoa'); 
        
const key = "c432fc78-3098-4ae5-abc8-8906f4c4aa52" /// user key from api_keys
const token = "75bf48cb-587f-40a1-8514-8b6f66d9e690" // token from api_keys

const auth = `Basic ${btoa(
    key + ":" + token
)}`; 


/*
//Returns session id and session token. Different than API keys and tokens. Use facility ops login info
//for some reason axios.post() doesn't work     
axios("https://api.sweepapi.com/account/auth", {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json',
    },
    data: JSON.stringify({
        'email': '',
        'password': '',
    })
})
.then(function (response) {
    //Stuff we sent
    //console.log(response.config); 
    //Return json 
    console.log("account/auth res: ", response.data);
    //getAPIKeyList(response.data); 
})
.catch(function (error) {
    console.log(error); 
}); 
*/ 


/*
//Authenticated with api key + token
//Returns a list of API keys
axios("https://api.sweepapi.com/account/auth/api_key", {
    method: 'GET',
    headers: {
        'Content-Type' : 'application/json',
        Authorization: auth,
    }
})
.then(function (response) {
    //Return json
    console.log("API Key list: ", response.data); 
})
.catch(function (error) {
    console.log(error); 
});
*/ 

//API request to create a directory. Returns status ok and directory id if done successfully 
axios("https://api.sweepapi.com/directory", {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json',
        Authorization: auth,
    },
    data: {
        "name": "DirectoryName"
    }
})
.then(function (response) {
    //Return json
    console.log("directory: ", response.data);  
    createSubDir(response.data["id"]); 
    createStream(response.data["id"]);
})
.catch(function (error) {
    console.log(error); 
});  


//Creating a directory under a home directory
function createSubDir(directoryID) {
    axios("https://api.sweepapi.com/directory", {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json',
        Authorization: auth,
    },
    data: {
        "name": "DirectoryName2", 
        "dirtop": directoryID
    }
    })
    .then(function (response) {
        //Return json
        console.log("sub dir: ", response.data); 
    })
    .catch(function (error) {
        console.log(error); 
    });
} 


function createStream(directoryID) {
    config_req = {
        auth: {
            username: key,
            password: token
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    data = {
        "directory_id": directoryID,
        "name": "test stream 23e2",
        "inputDataVar": [
            {
                "var_name": "voltage_b",
                "display_name": "Voltage b",
                "description": "Voltage b amps",
                "units": "volts",
                "type": "number"
            },
            {
                "var_name": "current_b",
                "display_name": "Current b",
                "description": "Current b amps",
                "units": "amps",
                "type": "number"
            },
            {
                "var_name": "log_maintenance",
                "display_name": "Maintenance Log",
                "description": "Maintenance Log over time",
                "units": "unitless",
                "type": "text"
            }
        ]
    }
    axios.post("https://api.sweepapi.com/stream", data, config_req)
    .then(function (response) {
        //Return json
        console.log("create stream: ", response.data); 

        postStreamData(response.data["stream_id"], "voltage_b"); 
    })
    .catch(function (error) {
        console.log(error); 
    });
}


function postStreamData(streamID, ts_param) {
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
        "timestamp" : "2021-05-06T09:00:00.000Z",
        "sample" : "887.0"
    }
    axios.post("https://api.sweepapi.com/stream/"+streamID+"/ts/"+ts_param+"/dataset", data, config_req)
    .then(function (response) {
        console.log("added data to stream: ", response.data); 
        verifyDataOnStream(streamID, ts_param); 
    })
    .catch(function (error) {
        console.log(error); 
    });
}

function verifyDataOnStream(streamID, ts_param) {
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
    axios.get("https://api.sweepapi.com/stream/"+streamID+"/ts/"+ts_param+"/dataset?span=raw&time_scale=custom&range_start=2021-05-06T05:00:00.000Z&range_end=2021-05-07T04:34:07.000Z&limit=&ts_type=avg", config_req)
    .then(function (response) {
        console.log("data added to the stream: ", response.data); 
         
    })
    .catch(function (error) {
        console.log(error); 
    });
}


/*    
//Simply returns status ok if your authentication is verified
axios("https://api.sweepapi.com/account/verify_auth", {
    method: 'GET',
    headers: {
        'Content-Type' : 'application/json',
        Authorization: auth,
    }
})
.then(function (response) { 
    //Return json 
    console.log("account/verify_auth res: ", response.data);
})
.catch(function (error) {
    console.log(error); 
});
*/ 


/*
//Checks the status of the sweep api. Works without authentication 
axios('https://api.sweepapi.com/platform/healthcheck', {
    method: 'GET',
    headers: {
        'Content-Type' : 'application/json'
    }
})
.then(function (response) { 
    //Return json 
    console.log("healthcheck: ", response.data);
})
.catch(function (error) {
    console.log(error); 
});
*/ 


/*
//Authenticated with session id + token (received from account/auth request)
function getAPIKeyList(session) {
    axios("https://api.sweepapi.com/account/auth/api_key", {
    method: 'GET',
    headers: {
        'Content-Type' : 'application/json',
        Authorization: `Basic ${btoa(
           session["session_id"] + ":" + session["session_token"]
        )}`,
    },
    })
    .then(function (response) {
        //Return json
        console.log(response.data); 
    })
    .catch(function (error) {
        console.log(error); 
    }); 
}
*/ 