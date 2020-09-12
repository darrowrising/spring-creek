import fs from 'fs';
import path from 'path';

// utils
import envHandler from './environmentHandler.utils';
// configs
import firebaseConfig from '../../configs/firebase.configs';

const generatedFilePath = path.resolve('./src/generatedFiles');

function createGeneratedFileDirectory() {
    if (!fs.existsSync(generatedFilePath)) fs.mkdirSync(generatedFilePath);
}

export default function writeClientEnvJson() {
    const filePath = path.join(generatedFilePath, 'envConfig.json');
    const configObject = {
        ...envHandler(),
        firebaseConfig: firebaseConfig[envHandler().dbEnv]
    };

    createGeneratedFileDirectory();

    fs.writeFileSync(filePath, JSON.stringify(configObject, null, '\t'));
}

writeClientEnvJson();
