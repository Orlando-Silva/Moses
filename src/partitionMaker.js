const ofx = require('ofx');
const initialPosition = 0;

module.exports = {

    createPartitions(ofxFile, maxEntries) {
     
        let partitions = [];

        console.log('OFX tem ' + ofxFile.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.length + ' lançamentos.');

        ofxFile.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN = generateUniqueDescription(ofxFile);

        while(hasEntries(ofxFile)) {
                  
            let partition = generateNewPartitionFromFile(ofxFile, maxEntries);
        
            // Para evitar que ambos objetos apontem para o mesmo endereço de memória.
            let ofxStructureShallowCopy = JSON.parse(JSON.stringify(ofxFile));

            // Para pegar a estrutura do OFX mas manter apenas os lançamentos que desejamos.
            ofxStructureShallowCopy.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN = partition;

            let partitionEntries = extractEntries(ofxFile, ofxStructureShallowCopy.body.OFX);

            partitions.push(partitionEntries);            
        }
        return partitions;
        
    },
}

function generateUniqueDescription(ofxFile) {
    ofxFile.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.forEach(element => {
        if(!isUnique(ofxFile, element)) {
            element.MEMO = element.MEMO + ' ' + generateUniqueId(ofxFile, element);
        }
    });
    return ofxFile.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;
}

function generateUniqueId(ofxFile, currentEntry) {
    let ofxStructureShallowCopy = JSON.parse(JSON.stringify(ofxFile));
    return ofxStructureShallowCopy.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.filter(f => { return f.MEMO == currentEntry.MEMO && f.TRNAMT == currentEntry.TRNAMT && f.DTPOSTED == currentEntry.DTPOSTED }).length;
}

function isUnique(ofxFile, currentEntry) {
    let ofxStructureShallowCopy = JSON.parse(JSON.stringify(ofxFile));
    return ofxStructureShallowCopy.body.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN.filter(f => { return f.MEMO == currentEntry.MEMO && f.TRNAMT == currentEntry.TRNAMT && f.DTPOSTED == currentEntry.DTPOSTED }).length == 1;
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