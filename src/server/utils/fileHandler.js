import fs from 'fs';
import path from 'path';
import colors from 'colors';

/* Create a directory in a file path if no directory in the path is found */
export function createDirectoryPath(filePath) {
  if (!fs.existsSync(filePath)) {
    let pathState = path.resolve();
    const root = filePath.replace(`${pathState}/`, '');
    const dirArray = root.split('/');

    dirArray.forEach((item) => {
      const isFile = item.split('.')[1];
      const newPath = path.join(pathState, item);

      if (!fs.existsSync(newPath) && !isFile) fs.mkdirSync(newPath);
      pathState = newPath;
    });
  }
}

export function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(colors.red(`\n Error writing file ${filePath.split('/').pop()}\n`));
  }
}

export function readFile(filePath) { // eslint-disable-line
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(colors.red(`\n Error reading file ${filePath.split('/').pop()}\n}`));
  }
}
