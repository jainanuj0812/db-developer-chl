describe("Update CurrencyPair Table", function() {
    var UpdateTable= require('../../lib/UpdateCurrencyPairTable');
    var UpdateTableObj;

    describe("Creating Table", function() {
        beforeEach(function() {
            UpdateTableObj = new UpdateTable();
            jasmine.clock().install(); // Added mock clock to test async methods.
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it("should be able to intialize the table", function() {
            expect(UpdateTableObj.initTable()).toBeDefined();  // Testing of the data table initialize or not
        });

        it("should register the sparkline update", function() {
            spyOn(UpdateTableObj, "updateSparkLine");

            UpdateTableObj.initTable();
            jasmine.clock().tick(40000);  // updateSparkLine should get called in this time.

            expect(UpdateTableObj.updateSparkLine).toHaveBeenCalled();
        });

    });

    describe("creating header", function() {
        beforeEach(function() {
            UpdateTableObj = new UpdateTable();
            UpdateTableObj.initTable();
        });

        it("should be able to create header for the table", function() {
            expect(UpdateTableObj.createHeader()).toBeDefined(); // Testing header creation of the table
        });
    });

    describe("Adding/Updating New Data into the Table", function() {
        beforeEach(function() {
            UpdateTableObj = new UpdateTable();
            UpdateTableObj.initTable();
            UpdateTableObj.createHeader();
            UpdateTableObj.currencyPairData = [
                {
                    "name": "eudphy",
                    "bestBid": 106.7297012204255,
                    "bestAsk": 107.25199883791178,
                    "openBid": 107.22827132623534,
                    "openAsk": 109.78172867376465,
                    "lastChangeAsk": -4.862314256927661,
                    "lastChangeBid": -2.8769211401569663
                },
                {
                    "name": "usdjpy",
                    "bestBid": 106.7297012204255,
                    "bestAsk": 107.25199883791178,
                    "openBid": 107.22827132623534,
                    "openAsk": 109.78172867376465,
                    "lastChangeAsk": -4.862314256927661,
                    "lastChangeBid": -2.8769211401569663
                },
                {
                    "name": "usdhup",
                    "bestBid": 106.7297012204255,
                    "bestAsk": 107.25199883791178,
                    "openBid": 107.22827132623534,
                    "openAsk": 109.78172867376465,
                    "lastChangeAsk": -4.862314256927661,
                    "lastChangeBid": -2.8769211401569663
                }
            ];
        });
        it("should be able to push new data into the table", function() {
            UpdateTableObj.currencyPairData = [];
            var data = {
                "name": "usdjpy",
                "bestBid": 106.7297012204255,
                "bestAsk": 107.25199883791178,
                "openBid": 107.22827132623534,
                "openAsk": 109.78172867376465,
                "lastChangeAsk": -4.862314256927661,
                "lastChangeBid": -2.8769211401569663
            };
            Sparkline = jasmine.createSpy();   // Ignoring Sparkline
            Sparkline.draw = jasmine.createSpy(); // Ignoring Sparkline's method draw.
            expect(UpdateTableObj.addUpdateRow(data)).not.toBeLessThan(1);
        });
        it("should be able to check if data exist in current array of currency pair", function() {
            var data = {
                "name": "usdjpy",
                "bestBid": 106.7297012204255,
                "bestAsk": 107.25199883791178,
                "openBid": 107.22827132623534,
                "openAsk": 109.78172867376465,
                "lastChangeAsk": -4.862314256927661,
                "lastChangeBid": -2.8769211401569663
            };

            expect(UpdateTableObj.ifDataExist(data)).not.toBeLessThan(0);
        });
        it("should be able to check if data not exist in current array of currency pair", function() {
            var data = {
                "name": "usdyup",
                "bestBid": 106.7297012204255,
                "bestAsk": 107.25199883791178,
                "openBid": 107.22827132623534,
                "openAsk": 109.78172867376465,
                "lastChangeAsk": -4.862314256927661,
                "lastChangeBid": -2.8769211401569663
            };

            expect(UpdateTableObj.ifDataExist(data)).toBeLessThan(0);
        });
    });
});
