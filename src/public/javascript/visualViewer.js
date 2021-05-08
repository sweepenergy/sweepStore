function readFile() {
  $.ajax({
    url: '../datasets/client_data.csv',
    dataType: 'text',
  }).done(showInitialFormat,showSweepFormat);
}

function showInitialFormat(data) {
  var allRows = data.split(/\r?\n|\r/);
  var table = '<table>';
  
  for (var singleRow = 0; singleRow < 11; singleRow++) {
    if (singleRow === 0) {
      table += '<thead>';
      table += '<tr>';
    } else {
      table += '<tr>';
    }
    var rowCells = allRows[singleRow].split(',');
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (singleRow === 0) {
        table += '<th>';
        table += rowCells[rowCell];
        table += '</th>';
      } else {
        table += '<td>';
        table += rowCells[rowCell];
        table += '</td>';
      }
    }
    if (singleRow === 0) {
      table += '</tr>';
      table += '</thead>';
      table += '<tbody>';
    } else {
      table += '</tr>';
    }
  } 
  table += '</tbody>';
  table += '</table>';
  $('.columnL').append(table);
}

function showSweepFormat(data)
{

  var allRows = data.split(/\r?\n|\r/);

  // will add header with attribute names for the user to know what they aer changing
  var table = '<table id="SelectionTable">';  

  table += '<thead>';
  table += '<tr>';

  var rowCells = allRows[0].split(',');

  for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {

          table += '<th>';
          table += rowCells[rowCell];
          table += '</th>';
  }

  table += '</tr>';

       //Adding a new row that will contain the option to select the type each column will be (directory, timestamp, stream, ts_param, or not applicable)
       table += '<tr>';   

       for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
   
           table += '<td>';
           table += '<select class=\"form-control\" id=\"';
           table += rowCells[rowCell];
           table += '\">';
           table += '<option value="dir">directory</option>';
           table += '<option value="timestamp">timestamp</option>';
           table += '<option value="stream">stream</option>';
           table += '<option value="ts_param">ts_param</option>';
           table += '<option selected value="notApp">not applicable</option>';
           table += '</select>';
           table += '</td>';
   
       }
   
       table += '</tr>';
       table += '</tbody>';
       table += '</table>';
       $('.columnMiddle').append(table);


       var radioBtn = "<br><p>Have you selected one of your headers as a stream? </p><br><form><input type=\"radio\" name=\"choice\" value=\"yes\"> Yes ";
       radioBtn = radioBtn + "<input type=\"radio\" name=\"choice\" value=\"no\"> No ";
       radioBtn = radioBtn + "<input type=\"button\" id=\"btn\" value=\"Confirm\" onclick=getValueForStream()></form>";

       $('.columnMiddle').append(radioBtn);

} 

function getValueForStream(){
  //get the value of the radio button to determine if the user has used a header as a stream
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
    var textBox = "<br><p>Type the name you would like to call your stream and press confirm.</p>";
    textBox = textBox + "<form><input id=\"streamText\" placeholder=\"stream name\" required>";
    textBox = textBox + "<input type=\"button\" id=\"stream-btn\" value=\"Add Stream\" onclick=\"setColumnTypes()\"></form>";
    $(".columnMiddle").append(textBox);
  }
  else {
    setColumnTypes();
  }
}

function setColumnTypes()
{ 
  var table = document.getElementById("SelectionTable");
  var columnTypes = {};

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

          //insert the key and value to the dictionary "columnTypes", if value is a stream 
          columnTypes[key]=value; 
    
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

    if(streamName == ""){
      alert("Please type a name for your stream.");
      return;
    }
    columnTypes.streamColumn = streamName;
  }

  showFileStructure(columnTypes);

  //sending the list of column types to the server
  if(columnTypes) {
    $.post('/import', columnTypes); 
  }

  var successBtn = "<form action=\"/import\" method=\"POST\">";
  successBtn = successBtn + "<input type=\"submit\" name=\"success\" value=\"Import\" style=\"color: white; background-color: #001648; padding: 10px 15px; border: none; text-align: center; align-items: center;\" /></form>";
  $(".successBtn").append(successBtn);
}


// I would like to create another button that refreshes the tree with the newest structure
// this would allow the user to make changes as they see fit

// currently we are calling the function showFilesStructure once we have set everything and confirmed that this structure is the one the user wants
// I have called showFileStructure() from setColumnTypes() because that is where we have all the final types  


function showFileStructure(columnTypes){
  
  var tree = "";
  var streamName = "";
  var dirName = "";
  var ts_params = [];

  // get the names for each type
  for (x in columnTypes){
    if(columnTypes[x] == "directory"){
      dirName = x;
    } else if(columnTypes[x] == "stream"){
      streamName = x;
    } else if(columnTypes[x] == "ts_param"){
      ts_params.push(x);
    } else if(x == "streamColumn"){   // this condition applies to when the user gives a name for a stream
      streamName = columnTypes[x];
    } 
    // console.log("Value: " + columnTypes[x] + ", Name: " + x);
  }

  // create the tree with the received information
  tree += '<li><span class=\"caret\">' + dirName + '</span>';
  tree += '<ul class=\"nested\">';
  tree += '<li><span class=\"caret\">' + streamName + '</span>';
  tree += '<ul class=\"nested\">';
  for(x in ts_params){
    tree += '<li>' + ts_params[x] + '</li>';
  }
  tree += '</ul>';
  tree += '</li>';
  tree += '</ul>';
  tree += '</li>';
  tree += '</ul>';

  $('.fileStructure').append(tree);

}