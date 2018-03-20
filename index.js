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
  var currencyPairTable = new Array();
  var currencyPairTableHeader = new Array();

  currencyPairTableHeader.push(["Name", "Best Bid", "Best Ask Price", "Best Bid Last Changed", "Best Ask Price Last Changed", "Updates"]);
  //Create a HTML Table element.
  var table = document.createElement("TABLE");
  table.border = "1";
  var sparkLineData = [];

  //Get the count of columns.
  var columnCount = currencyPairTableHeader[0].length;

  //Add the header row.
  var row = table.insertRow(-1);
  for (var i = 0; i < columnCount; i++) {
      var headerCell = document.createElement("TH");
      headerCell.innerHTML = currencyPairTableHeader[0][i];
      row.appendChild(headerCell);
  }

  setInterval(function() {
    for (var j = 0; j < currencyPairTable.length; j++) {
      var midPrice = (currencyPairTable[j].bestBid + currencyPairTable[j].bestAsk) / 2;
      sparkLineData[j].push(midPrice);
      console.log(sparkLineData[j]);
      var rowr = table.getElementsByTagName('tr')[j+1];
      if (rowr.getElementsByTagName('td')[currencyPairTableHeader[0].length-1]) {
        rowr.deleteCell(currencyPairTableHeader[0].length-1);
      }
      var cell = rowr.insertCell(currencyPairTableHeader[0].length-1);
      Sparkline.draw(cell, sparkLineData[j]);
    }
  }, 30000);

  //Add the data rows.
  function addUpdateRow(data, index) {
    if (index !== -1) {
      table.deleteRow(index);
      currencyPairTable[index-1] = data;
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
    for (var j = 0; j < currencyPairTable.length; j++) {
      if (data.name == currencyPairTable[j].name) {
        addData = false;
        addUpdateRow(data, j+1);
        break;
      }
    }
    if (addData) {
      currencyPairTable.push(data);
      sparkLineData.push([]);
      addUpdateRow(data, -1);
    }
  }
  var dvTable = document.getElementById("data-table");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);


  client.subscribe('/fx/prices', function(data) {
    var message = JSON.parse(data.body);
    var data = {
      name: message.name,
      bestBid: message.bestBid,
      bestAsk: message.bestAsk,
      lastChangedBid: message.lastChangeBid,
      lastChangeAsk: message.lastChangeAsk,
    };
    ifDataExist(data);
  });
  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
});