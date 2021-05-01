// const { dataOrg } = require("./dataOrganizer");

function readFile(fname) {
  $.ajax({
    url: '../datasets/' + fname,
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

      //  radioBtn = radioBtn + "<script> const btn.onclick = function () {";
      //  radioBtn = radioBtn + " const rbs = document.querySelectorAll('input[name=\"choice\"]');";
      //  radioBtn = radioBtn + " let selectedValue;";
      //  radioBtn = radioBtn + " for (const rb of rbs) { ";
      //  radioBtn = radioBtn + "     if (rb.checked) { ";
      //  radioBtn = radioBtn + "         selectedValue = rb.value; ";
      //  radioBtn = radioBtn + "         break; ";
      //  radioBtn = radioBtn + "     } ";
      //  radioBtn = radioBtn + " } ";
      //  radioBtn = radioBtn + " alert(selectedValue); ";
      //  radioBtn = radioBtn + "}; ";
      //  radioBtn = radioBtn + "</script>";

       $('.columnMiddle').append(radioBtn);

} 



