const axios = require('axios');
        

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
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error); 
    }); 

 
//not working, get 'error_missing_auth' error, tried with email & password but didn't work either
function createDir() {
    let auth_user_id = "" /// user key from api_keys
    let auth_token = "" // token from api_keys
    axios("https://api.sweepapi.com/directory", {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json',
        'data-raw': 'DirectoryName'
    },
    data: JSON.stringify({
        'key': auth_user_id, 
        'token': auth_token
    })
    })
    .then(function (response) {
        //Return json
        console.log(response.data); 
    })
    .catch(function (error) {
        console.log(error); 
    }); 
}
createDir(); 

