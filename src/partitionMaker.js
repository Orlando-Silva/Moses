const ofx = require('ofx');
const initialPosition = 0;

module.exports = {

    createPartitions(ofxFile, maxEntries) {
     
        let partitions = [];

        while(hasEntries(ofxFile)) {
            let partition = generateNewPartitionFromFile(ofxFile, maxEntries);

            // Para evitar que ambos objetos apontem para o mesmo endereço de memória.
            let ofxStructureShallowCopy = JSON.parse(JSON.stringify(ofxFile));

            // Para pegar a estrutura do OFX mas manter apenas os lançamentos que desejamos.
            ofxStructureShallowCopy.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN = partition;

            let partitionEntries = extractEntries(ofxFile, ofxStructureShallowCopy.body);

            partitions.push(partitionEntries);            
        }
        return partitions;
    },
}

function extractEntries(ofxFile, partition) {
    return ofx.serialize(ofxFile.header, partition);
}

function generateNewPartitionFromFile(ofxFile, maxEntries) {
    return ofxFile.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.splice(initialPosition, maxEntries);
}

function hasEntries(ofxFile) {
    return ofxFile.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.length > 0;
}