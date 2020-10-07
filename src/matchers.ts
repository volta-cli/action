import * as path from 'path';
import * as glob from '@actions/glob';

export default async function addMatchers(
  matchersPath = path.join(__dirname, '..', 'matchers')
): Promise<void> {
  const globber = await glob.create(path.join(matchersPath, '*.json'));

  for await (const file of globber.globGenerator()) {
    console.log(`##[add-matcher]${file}`);
  }
}
