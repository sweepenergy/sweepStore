function readFile()
{
  $.ajax({
    url: 'dummyData/cereal.csv',
    dataType: 'text',
  }).done(showInitialFormat,showSweepFormat);
}


function showInitialFormat(data) {
  var allRows = data.split(/\r?\n|\r/);
  var table = '<table>';
  
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
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
  var tree = '<ul>'

  $('.columnR').append(tree);
}

function editFormat()
{

}

