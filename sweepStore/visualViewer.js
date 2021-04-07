const { dataOrg, parse } = require("./dataOrganizer");
dataOrg();

function readFile()
{
  parse();

}


function showInitialFormat(data) 
{
    var tableDisplay = document.getElementsByTagName("TableDisplay")[0];
    var allRows = data.split(/\r?\n|\r/);
    var table = document.createElement("table");

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
    $('TableDisplay').append(table);
}

function showSweepFormat()
{

}

function editFormat()
{

}

