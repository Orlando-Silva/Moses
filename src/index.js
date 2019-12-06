const banking = require('banking');
const partitionMaker = require('./partitionMaker.js');
const ofxWriter = require('./ofxWriter.js');
const argv = require('yargs')
    .usage('usage: -f [The OFX file that will be partitioned] -m [Max entries per partition] -o [The output folder where the partitions will be saved]')
    .help('help')
    .alias('f', 'file')
    .describe('f', 'The OFX file that will be partitioned')
    .alias('m', 'max')
    .describe('m', 'Max entries per partition')
    .alias('o', 'output')
    .describe('o', 'The output folder where the partitions will be saved')
    .strict(true)
    .demandOption(['f','m'])
    .argv;

banking.parseFile(argv.f, function (content) {

    let partitions = partitionMaker.createPartitions(content, parseInt(argv.m));

    ofxWriter.createOFXFiles(partitions, argv.o);

});



