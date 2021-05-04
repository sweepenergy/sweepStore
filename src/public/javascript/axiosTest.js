const axios = require('axios');
const btoa = require('btoa'); 
        
const key = "" /// user key from api_keys
const token = "" // token from api_keys

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
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin":"*"
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