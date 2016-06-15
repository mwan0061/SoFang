var nodeunit = require('nodeunit');


exports['read'] = nodeunit.testCase({

    setUp: function () {
        this._openStdin = process.openStdin;
        this._log = console.log;
        this._calculate = doubled.calculate;
        this._exit = process.exit;

        var ev = this.ev = new events.EventEmitter();
        process.openStdin = function () { return ev; };
    },
    tearDown: function () {
        // reset all the overidden functions:
        process.openStdin = this._openStdin;
        process.exit = this._exit;
        doubled.calculate = this._calculate;
        console.log = this._log;
    },

    'a value other than a number': function (test) {
        test.expect(1);

        process.exit = test.done;
        doubled.calculate = function () {
            throw new Error('Expected a number');
        };
        console.log = function (str) {
            test.equal(str, 'Error: Expected a number');
        };
        doubled.read();
        this.ev.emit('data', 'asdf');
    },

    'a number': function (test) {
        test.expect(1);

        process.exit = test.done;
        console.log = function (str) {
            test.equal(str, 'doubled: 24');
        };
        doubled.read();
        this.ev.emit('data', '12');
    }

});