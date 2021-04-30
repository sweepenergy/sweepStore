function getValueForStream(){
    //get the value of the radio button to determine if the user has used a header as a stream
    const btn = document.querySelector('#btn');
  
    const rbs = document.querySelectorAll('input[name=\"choice\"]');
    let selectedValue;
    for(const rb of rbs){
      if(rb.checked){
        selectedValue = rb.value;
        break;
      }
    }
  
        //create a text box for user to add the name for the stream
    if(selectedValue == "no"){
      var textBox = "<br><p>Type the name you would like to call your stream.</p>";
      textBox = textBox + "<input id =\"streamText\" placeholder=\"stream name\">";
      $(".columnMiddle").append(textBox);
    }
  
  
  }
  
  function passToDataOrg()
  { 
    var table = document.getElementById("SelectionTable");
    var columnFields = {};
  
    // will be keeping count of these 3 values to make sure that the user does not input more than 1, and if streams remains as 0 then we ask the user if we can put all the data into one stream.
    var dirCount = 0;
    var streamCount = 0;
    var timestampCount = 0;
    var streamName = "";
  
    //iterate through the column field selection table
    for (var r = 0; r < 1; r++) {
        for (var c = 0; c < table.rows[r].cells.length; c++) {
            var key = table.rows[r].cells[c].innerHTML;
            var adjustedcurrentColumnName= "#" +  key + " option:selected";
            var value = $(adjustedcurrentColumnName).text();
  
            //Checking which types are selected
            if (value == "directory"){
              dirCount++;
            }
            if(value == "stream"){
              streamCount++;
  
            }
            if(value == "timestamp"){
              timestampCount++;
            }
  
            //insert the key and value to the dictionary "columnFields", if value is a stream 
            if(value == "stream"){
              streamName = key;
            }else{
              columnFields[key]=value; 
            }
            
        }
    }
  
    // current way to display if changes need to be made by the user as to what has been selected
    if(dirCount > 1){
      alert("You have chosen more than 1 directory, choose just one and submit again.");
      return;
    }else if(streamCount > 1){
      alert("You have chosen more than 1 stream, choose just one and submit again.");
      return;
    }else if (timestampCount > 1){
      alert("You have chosen more than 1 timestamp, choose just one and submit again.");
      return;
    }else if(dirCount == 0 || timestampCount == 0){
      alert("You must have at least one directory and one timestamp.");
      return;
    }else if(streamCount == 0){
      //get the name of the new stream from the id="streamText"
      streamName = document.getElementById("streamText").value;
      ;
    }
    
  
    console.log(columnFields);
    console.log(streamName);
  
    dataOrg(columnFields, streamName);
  }
  