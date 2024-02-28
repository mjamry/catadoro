// DESCRIPTION
// Script to update app version
// ARGS:
//  1 - file name to
//  2 - update type = 'minor' | 'major'

const fs = require('fs');

function minorUpdate(version) {
    const parts = version.split('.');
    const currentVersion = parseInt(parts[parts.length - 1])
    parts[parts.length - 1] = currentVersion + 1;
    return parts.join('.');
}

function majorUpdate(version) {
    const parts = version.split('.');
    const currentVersion = parseInt(parts[parts.length - 2])
    parts[parts.length - 2] = currentVersion + 1;
    parts[parts.length - 1] = 0;
    return parts.join('.');
}

// Read the file name from command line arguments
const fileName = process.argv[2];
let updateType = process.argv[3];

if(fileName === undefined || fileName === null){
    console.error('ERROR: File name not provided');
    process.exit(1);
}

if(updateType !== 'minor' && updateType !== 'major'){
    updateType = 'minor';
}

// Read the JSON file
fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        console.error('ERROR: cannot read file:', err);
        process.exit(1);
    }

    try {
        const jsonData = JSON.parse(data);

        if(updateType === 'minor'){
            const currentVersion = jsonData.expo.version;
            const newVersion = minorUpdate(currentVersion);
            jsonData.expo.version = newVersion;
        } else {
            //app version
            const currentVersion = jsonData.expo.version;
            const newVersion = majorUpdate(currentVersion);
            jsonData.expo.version = newVersion;

            //runtime version
            const currentRuntimeVersion = jsonData.expo.runtimeVersion;
            const newRuntimeVersion = majorUpdate(currentRuntimeVersion);
            jsonData.expo.runtimeVersion = newRuntimeVersion;
        }

        // Write the updated JSON back to the file
        fs.writeFile(fileName, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                process.exit(1);
            }
            console.log(`Successfully incremented ${updateType} version.`);
            console.log(`Runtime: ${jsonData.expo.runtimeVersion} | App: ${jsonData.expo.version}`);
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        process.exit(1);
    }
});
