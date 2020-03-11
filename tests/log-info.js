const path = require('path');
const walkSync = require('walk-sync');

console.log(`Current $PATH:\n\n${process.env.PATH}`);

const voltaHomeBinContents = walkSync(path.join(process.env.VOLTA_HOME, 'bin'));
console.log(`Current contents of ${path.join('$VOLTA_HOME', 'bin')}\n\n${voltaHomeBinContents}`);
