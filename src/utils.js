import fs from 'fs';
import path from 'path';




const __filename = import.meta.url.substring('file:///'.length);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');

export default {rootDir, __dirname};