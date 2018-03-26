/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html');
// Apply the styles in style.css to the page.
require('./site/style.css');
var UpdateCurrencyPairTable = require('./lib/UpdateCurrencyPairTable');

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
    var updateCurrencyPairTable = new UpdateCurrencyPairTable();

    updateCurrencyPairTable.initTable();
    updateCurrencyPairTable.createHeader();


  // Subscribing the data
    client.subscribe('/fx/prices', function(message) {
        var currencyPairs = JSON.parse(message.body);
        var data = {};
        Object.keys(updateCurrencyPairTable.config.headerData).forEach(function(key){
            if (currencyPairs[key] !== undefined) {
                data[key] = currencyPairs[key]
            }
        });
        updateCurrencyPairTable.addUpdateRow(data);
    });
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
});