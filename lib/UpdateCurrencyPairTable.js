function UpdateCurrencyPairTable(){}

UpdateCurrencyPairTable.prototype.currencyPairData = new Array(); // will be used to store the actual data.
UpdateCurrencyPairTable.prototype.columnCount = 0; // Count for the headers columns.
UpdateCurrencyPairTable.prototype.sparkLineData = new Array(); // will be used as array of arrays containing mid prices for each currency pair.

UpdateCurrencyPairTable.prototype.config = {
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

UpdateCurrencyPairTable.prototype.initTable = function() {
    //Create a HTML Table element.
    this.table = document.createElement("TABLE");
    this.table.border = "1";
    var dvTable = document.getElementById("data-table");
    dvTable.innerHTML = "";
    dvTable.appendChild(this.table);
    setInterval(this.updateSparkLine.bind(this), this.config.sparkLineUpdateTime); // Updating the sparkLine after every 30 sec.
    return this.table;
};

UpdateCurrencyPairTable.prototype.createHeader = function() {
    var row = this.table.insertRow(-1);
    var that = this;
    Object.keys(this.config.headerData).forEach(function(k){
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = that.config.headerData[k];
        row.appendChild(headerCell);
        that.columnCount++;
    });
    return row;
};

UpdateCurrencyPairTable.prototype.addUpdateRow = function(data) {
    var index = this.ifDataExist(data); // Check if data exist in the current table,
    if (index !== -1) {
        this.table.deleteRow(index); // If data exist delete the row and will be replaced with the updated one in below code.
        this.currencyPairData[index-1] = data;
    } else {
        this.currencyPairData.push(data);
        this.sparkLineData.push([]); // Add an blank array in sparkline data for this particular row
    }
    var row = this.table.insertRow(index);
    Object.keys(data).forEach(function(key){
        var cell = row.insertCell(-1);
        cell.innerHTML = data[key]; // Copy data to the cells
    });
    var sparkLineCell = row.insertCell(-1);
    Sparkline.draw(sparkLineCell, this.sparkLineData[index-1]); // As we have deleted the row, if data exists to still show the spakLine, we are coping the data.
    this.sortTable(this.table, 3);  // Sort table on the basis of lastChangedBid.

    return row.rowIndex;
};

UpdateCurrencyPairTable.prototype.ifDataExist = function(data) {
    var dataFoundAtIndex = -1;
    for (var index = 0; index < this.currencyPairData.length; index++) {
        if (data.name === this.currencyPairData[index].name) {
            dataFoundAtIndex = index + 1;  // Data found on this index
            break;
        }
    }
    return dataFoundAtIndex;
};

UpdateCurrencyPairTable.prototype.updateSparkLine = function () {
    for (var index = 0; index < this.currencyPairData.length; index++) {
        var midPrice = (this.currencyPairData[index].bestBid + this.currencyPairData[index].bestAsk) / 2;
        if (this.sparkLineData[index].length === 10) {
            this.sparkLineData[index].shift();
            this.sparkLineData[index].push(midPrice);
        } else {
            this.sparkLineData[index].push(midPrice);
        }
        var dataRow = this.table.getElementsByTagName('tr')[index + 1];
        if (dataRow.getElementsByTagName('td')[this.columnCount - 1]) {
            dataRow.deleteCell(this.columnCount - 1);
        }
        var cell = dataRow.insertCell(this.columnCount - 1);
        Sparkline.draw(cell, this.sparkLineData[index]);
    }
};

UpdateCurrencyPairTable.prototype.sortTable = function(table, columnIndex) {
    var rows, switching, i, x, y, shouldSwitch;
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
            var switchData = [];
            /* If a switch has been marked, make the switch
             and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);

            /* If a switch has been marked, make the switch
             to currencyPairData as well */
            switchData = this.currencyPairData[i-1];
            this.currencyPairData[i-1] = this.currencyPairData[i];
            this.currencyPairData[i] = switchData;

            /* If a switch has been marked, make the switch
             to sparkLineData as well */
            switchData = this.sparkLineData[i-1];
            this.sparkLineData[i-1] = this.sparkLineData[i];
            this.sparkLineData[i] = switchData;
            switching = true;
        }
    }
};

module.exports = UpdateCurrencyPairTable;
