const execa = require('execa');
const got = require('got');

async function main() {
  const command = process.argv[2];
  let expectedVersion = process.argv[3];

  if (command === 'volta' && expectedVersion === 'latest') {
    expectedVersion = await got('https://volta.sh/latest-version');
  }

  const result = await execa(command, ['--version']);
  const actualVersion = result.stdout;

  console.log(
    `Expected \`${command} --version\` to return \`${expectedVersion}\`; received \`${actualVersion}\`.`
  );

  if (actualVersion !== expectedVersion) {
    process.exitCode = 1;
  }
}

main();
