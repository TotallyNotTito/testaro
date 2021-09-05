/*
  comboTable.js
  Converts combo data from JSON to an HTML table.
*/
// ########## IMPORTS
// Module to access files.
const fs = require('fs');
// Module to keep secrets local.
require('dotenv').config();
// ########## OPERATION
// Directories.
const reportDir = process.env.BATCHREPORTDIR;
const reportSubdir = process.argv[2];
const fileID = process.argv[3];
// Get the data.
const dataJSON = fs.readFileSync(`${reportDir}/${reportSubdir}/${fileID}.json`, 'utf8');
const data = JSON.parse(dataJSON);
// Identify the containing code.
const tableStartLines = [
  '<table>',
  '  <thead>',
  '    <tr><th rowspan="2">Page</th><th colspan="2">Deficit as a</th></tr>',
  '    <tr><th>Number</th><th>Bar</th>',
  '  </thead>',
  '  <tbody class="firstCellRight">'
];
const tableEndLines = [
  '  </tbody>',
  '</table>'
];
// Calibrate the bar widths.
const maxDeficit = data.reduce((max, currentItem) => Math.max(max, currentItem.deficit), 0);
// Compile the code representing the data.
const tableMidLines = data.map(item => {
  const pageCell = `<th><a href="${item.url}">${item.org}</a></th>`;
  const numCell = `<td>${item.deficit}</td>`;
  const barWidth = maxDeficit ? 100 * item.deficit / maxDeficit : 0;
  const bar = `<rect height="100%" width="${barWidth}%" fill="red"></rect>`;
  const barCell = `<td><svg width="100%" height="1rem">${bar}</svg></td>`;
  const row = `    <tr>${pageCell}${numCell}${barCell}</tr>`;
  return row;
});
// Combine the containing and contained lines of code.
const tableLines = tableStartLines.concat(tableMidLines, tableEndLines);
const table = tableLines.join('\n');
// Create the file.
fs.writeFileSync(`${reportDir}/${reportSubdir}/${fileID}.html`, `${table}\n`);