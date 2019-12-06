const banking = require('banking');
const ofx = require('ofx');
const fs = require('fs');
const async = require('async');

var argv = require('yargs')
    .usage('Usage: -f [input file]')
    .help('help')
    .alias('f', 'file')
    .describe('f', 'The ofx file to partitionate')
    .strict(true)
    .demandOption(['f'])
    .argv;


banking.parseFile(argv.f, function (res) {

    var files = [];

    while(res.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.length > 0) {

        var test = res.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.splice(0, 20)

        var ofx_string = ofx.serialize(res.header, test);

        files.push(ofx_string);

    }

    async.each(files, function (file, callback) {

        fs.writeFile('testfinal' + files.indexOf(file) + '.ofx', file, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(file + '.json was updated.');
            }
    
            callback();
        });
    
    }, function (err) {
    
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
        }
        else {
            console.log('All files have been processed successfully');
        }
    });

});


