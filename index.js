/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html');
// Apply the styles in style.css to the page.
require('./site/style.css');

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false;

const url = "ws://localhost:8011/stomp";
const client = Stomp.client(url);
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
};

function connectCallback() {
  let currencyPairData = new Array();  // will be used to store the actual data.

  let config = {
    headerData: { // Headers for the data table, you can add new column heading here.
      name: 'Name',
      bestBid: 'Best Bid',
      bestAsk: 'Best Ask Price',
      lastChangeBid: 'Best Bid Last Changed',
      lastChangeAsk: 'Best Ask Price Last Changed',
      updates: 'SparkLine Updates'
    },
    sparkLineUpdateTime: 30000 // SparkLine graph update time.
  };

  //Create a HTML Table element.
  let table = document.createElement("TABLE");
  table.border = "1";
  let dvTable = document.getElementById("data-table");
  dvTable.innerHTML = "";
  dvTable.appendChild(table);

  let sparkLineData = []; // will be used as array of arrays containing mid prices for each currency pair.

  // Count for the headers columns.
  let columnCount = 0;

  // Add the header row.
  let row = table.insertRow(-1);
  Object.keys(config.headerData).forEach(function(k){
    let headerCell = document.createElement("TH");
    headerCell.innerHTML = config.headerData[k];
    row.appendChild(headerCell);
    columnCount++;
  });

  // Add/Updates the data rows.
  function addUpdateRow(data) {
    let index = ifDataExist(data); // Check if data exist in the current table,
    if (index !== -1) {
      table.deleteRow(index); // If data exist delete the row and will be replaced with the updated one in below code.
      currencyPairData[index-1] = data;
    } else {
      currencyPairData.push(data);
      sparkLineData.push([]); // Add an blank array in sparkline data for this particular row
    }
    row = table.insertRow(index);
    Object.keys(data).forEach(function(key){
        let cell = row.insertCell(-1);
        cell.innerHTML = data[key];
    });
    let sparkLineCell = row.insertCell(-1);
    Sparkline.draw(sparkLineCell, sparkLineData[index-1]);
    sortTable(table, 3);
  }

  function ifDataExist(data) {
    let dataFoundAtIndex = -1;
    for (let index = 0; index < currencyPairData.length; index++) {
      if (data.name === currencyPairData[index].name) {
        dataFoundAtIndex = index + 1;  // Data found on this index
        break;
      }
    }
    return dataFoundAtIndex;
  }

  client.subscribe('/fx/prices', function(message) {
    let currencyPairs = JSON.parse(message.body);
    let data = {};
    Object.keys(config.headerData).forEach(function(key){
      if (currencyPairs[key] !== undefined) {
          data[key] = currencyPairs[key]
      }
    });
    addUpdateRow(data);
  });

  function updateSparkLine() {
    for (let index = 0; index < currencyPairData.length; index++) {
      let midPrice = (currencyPairData[index].bestBid + currencyPairData[index].bestAsk) / 2;
      sparkLineData[index].push(midPrice);
      let dataRow = table.getElementsByTagName('tr')[index+1];
      if (dataRow.getElementsByTagName('td')[columnCount-1]) {
        dataRow.deleteCell(columnCount-1);
      }
      let cell = dataRow.insertCell(columnCount-1);
      Sparkline.draw(cell, sparkLineData[index]);
    }
  }
  setInterval(updateSparkLine, config.sparkLineUpdateTime);

    function sortTable(table, columnIndex) {
        let rows, switching, i, x, y, shouldSwitch;
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[columnIndex];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
                // Check if the two rows should switch place:
                if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                    // I so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            }
            if (shouldSwitch) {
                let switchData = [];
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);

                /* If a switch has been marked, make the switch
                to currencyPairData as well */
                switchData = currencyPairData[i-1];
                currencyPairData[i-1] = currencyPairData[i];
                currencyPairData[i] = switchData;

                /* If a switch has been marked, make the switch
                to sparkLineData as well */
                switchData = sparkLineData[i-1];
                sparkLineData[i-1] = sparkLineData[i];
                sparkLineData[i] = switchData;
                switching = true;
            }
        }
    }

}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
});