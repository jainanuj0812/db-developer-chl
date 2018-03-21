/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback() {
  var currencyPairData = new Array();  // will be used to store the actual data.

  var config = {
    headerData: {
      name: 'Name',
      bestBid: 'Best Bid',
      bestAsk: 'Best Ask Price',
      lastChangeBid: 'Best Bid Last Changed',
      lastChangeAsk: 'Best Ask Price Last Changed',
      updates: 'Updates'
    }
  };

  //Create a HTML Table element.
  var table = document.createElement("TABLE");
  table.border = "1";
  var sparkLineData = [];

  //Get the count of columns.
  var columnCount = 0;

  //Add the header row.
  var row = table.insertRow(-1);
  Object.keys(config.headerData).forEach(function(k){
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = config.headerData[k];
    row.appendChild(headerCell);
    columnCount++;
  });

  //Add the data rows.
  function addUpdateRow(data, index) {
    if (index !== -1) {
      table.deleteRow(index);
      currencyPairData[index-1] = data;
    }
    row = table.insertRow(index);
    Object.keys(data).forEach(function(k){
        var cell = row.insertCell(-1);
        cell.innerHTML = data[k];
    });
    var sparkCell = row.insertCell(-1);
    Sparkline.draw(sparkCell, sparkLineData[index-1]);
  }

  function ifDataExist(data) {
    var addData = true;
    for (var index = 0; index < currencyPairData.length; index++) {
      if (data.name == currencyPairData[index].name) {
        addData = false;
        addUpdateRow(data, index+1);
        break;
      }
    }
    if (addData) {
      currencyPairData.push(data);
      sparkLineData.push([]);
      addUpdateRow(data, -1);
    }
  }
  var dvTable = document.getElementById("data-table");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);


  client.subscribe('/fx/prices', function(data) {
    var message = JSON.parse(data.body);
    var data = {};
    Object.keys(config.headerData).forEach(function(key){
      if (message[key] !== undefined) {
          data[key] = message[key]
      }
    });
    ifDataExist(data);
  });

  setInterval(function() {
    for (var index = 0; index < currencyPairData.length; index++) {
      var midPrice = (currencyPairData[index].bestBid + currencyPairData[index].bestAsk) / 2;
      sparkLineData[index].push(midPrice);
      var dataRow = table.getElementsByTagName('tr')[index+1];
      if (dataRow.getElementsByTagName('td')[columnCount-1]) {
          dataRow.deleteCell(columnCount-1);
      }
      var cell = dataRow.insertCell(columnCount-1);
      Sparkline.draw(cell, sparkLineData[index]);
    }
  }, 30000);

}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
});