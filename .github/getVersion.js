const fs = require('fs');
const { program, Option } = require('commander');

program
  .description(`This script returns a specified field in a javascript or JSON file representing a version number. It provides flexibility in getting different version fields and supports custom file paths.`)
  .requiredOption('-f, --file <type>', 'File name to search')
  .option('--field <type>', 'Field in file to get', 'version')
  .parse(process.argv);

const options = program.opts();

fs.readFile(options.file, 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading file:', err);
      process.exit(1);
  }

  const regexPattern = new RegExp(`("${options.field}":\\s*")(\\d+(\\.\\d+){2})(")`);
  const match = regexPattern.exec(data);

  if(match == null || match[2] == null) {
    console.error(`Cannot find field "${options.field}" in the file ${options.file}`);
    process.exit(1);
  }

  console.log(`${match[2]}`);
});