describe("UpdateTable", function() {
    var UpdateTable= require('../../lib/UpdateTable');
    var UpdateTableObj;

    describe("Creating Table", function() {
        beforeEach(function() {
            UpdateTableObj = new UpdateTable();
            jasmine.clock().install();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it("should be able to intialize the table", function() {
            expect(UpdateTableObj.initTable()).toBeDefined();
        });

        it("should register the sparkline update", function() {
            spyOn(UpdateTableObj, "updateSparkLine");

            UpdateTableObj.initTable();
            jasmine.clock().tick(4000);

            expect(UpdateTableObj.updateSparkLine).toHaveBeenCalled();
        });

    });

    describe("creating header", function() {
        beforeEach(function() {
            UpdateTableObj = new UpdateTable();
            UpdateTableObj.initTable();
        });

        it("should be able to create header for the table", function() {
            expect(UpdateTableObj.createHeader()).toBeDefined();
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
            Sparkline = jasmine.createSpy();
            Sparkline.draw = jasmine.createSpy();
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
