const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();

workbook.xlsx.readFile('dummyData/test.xlsx')
    .then(function() {
        var worksheet = workbook.worksheets[0];
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
        });
    });