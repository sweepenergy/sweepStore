function readFile()
{
  $.ajax({
    url: 'src/public/datasets/cereal.csv',
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
  /*  This would show the customized format of the user's data
      It would be set to the user's needs  */
      
  // create the tree to show the path
  var allRows = data.split(/\r?\n|\r/);
  var tree = '<p class=\"tree\">Root</p>';

  var rowCells = allRows[0].split(',');

  for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      tree += '<ul class=\"tree\"><li>';
      tree += rowCells[rowCell];
      tree += '</li></ul>';
  }
  $('.columnR').append(tree);


  // will add header with attribute names for the user to know what they aer changing
  var table = '<table>';  

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
           table += '<option value="notApp">not applicable</option>';
           table += '</select>';
           table += '</td>';
   
       }
   
       table += '</tr>';
       table += '</tbody>';
       table += '</table>';
       $('.columnMiddle').append(table);

}

function editFormat()
{

}

