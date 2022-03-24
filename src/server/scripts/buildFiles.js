import path from 'path';
// utils
import { readFile, writeFile } from '../utils/fileHandler';

const txtPath = path.resolve('src/server/temp/hymn.txt');
const jsonPath = path.resolve('src/server/temp/hymn.json');

function buildFile() {
  const txtRaw = readFile(txtPath, 'utf8');
  const hymnsArray = txtRaw.split('\n');
  const hymnsData = hymnsArray.map((hymn, index) => ({
    number: index + 1,
    title: hymn,
  }));
  writeFile(jsonPath, JSON.stringify(hymnsData, null, 4));
}

buildFile();
