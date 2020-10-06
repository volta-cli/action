const path = require('path');
const walkSync = require('walk-sync');
const io = require('@actions/io');

(async function main() {
  console.log(`Current $PATH:\n\n${process.env.PATH}`);
  console.log(`Current $VOLTA_HOME:\n\n${process.env.VOLTA_HOME}`);
  const voltaHomeBinContents = walkSync(path.join(process.env.VOLTA_HOME, 'bin'));
  console.log(`Current contents of ${path.join('$VOLTA_HOME', 'bin')}\n\n${voltaHomeBinContents}`);

  console.log(`Path to volta: \n\n${await io.which('volta')}`);
  console.log(`Path to node: \n\n${await io.which('node')}`);
  console.log(`Path to yarn: \n\n${await io.which('yarn')}`);
})();
