const fs = require('fs');
const async = require('async');

module.exports = {
    
    createOFXFiles(partitions, folderName) { 
        
        createFolderIfDoesNotExist(folderName);

        async.each(partitions, function (partition, callback) {

            let filename = `./${folderName}/${ folderName }${ partitions.indexOf(partition) }.ofx`;

            fs.writeFile(filename, partition, function (error) {

                if (error) {
                    console.log(`Erro ao criar OFX: ${error}`);
                }
                else {
                    console.log(`${ filename } foi criado.`);
                }
        
                callback();
            });
        
            }, function (error) {
        
                if (error) {
                    console.log('Ocorreu algum erro no processamento de algum dos arquivos. Os logs acima devem ter mais informações.');
                }
                else {
                    console.log('O OFX foi particionado com sucesso!');
                }
        });
    }
}

function createFolderIfDoesNotExist(folderName) {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
}
