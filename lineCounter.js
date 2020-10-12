const fs = require('fs');
const readline = require('readline');
const path = require('path');

const dirname = process.argv[2];

const runOverDir = async (_dirname) => {
    let allLinesInDir = 0;

    const allEntries = fs.readdirSync(_dirname);
    console.log('allEntries', allEntries)
    for (const entry of allEntries) {
        const filename = path.resolve(_dirname, entry);
        const lsts = fs.lstatSync(filename);
        
        if (lsts.isDirectory()) {
            console.log('go to directory')
            allLinesInDir += await runOverDir(filename);
        } if (lsts.isFile()) {
            console.log('read file')
            allLinesInDir += await getFileLines(filename);
        }
    }

    return allLinesInDir
}

const getFileLines = (_path) => {
    return new Promise( (resolve, reject) => {
        let numOfLines = 0;
        
        var lineReader = readline.createInterface({
            input: fs.createReadStream(_path)
        });
        
        lineReader.on('line', (line) => {
            numOfLines++;
        });

        lineReader.on('close', () => {
            resolve(numOfLines);
        });
    });
}

(
    async () => console.log('allLines are:', await runOverDir(dirname))
)();