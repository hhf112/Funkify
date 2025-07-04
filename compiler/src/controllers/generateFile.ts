import fs from "fs"
import path from "path"


import { v4 as uuid } from "uuid"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



/**
 * @param {string} directory - path with directory name relative to compiler/src/controllers/.
 */
export const generateFile = async (directory: string, format: string, content: string) => {

  const dir = path.join(__dirname, directory);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const jobID = uuid();
  const filename = `${jobID}.${format}`;
  const filePath = path.join(dir, filename);
  try {
  await fs.writeFileSync(filePath, content);
  } catch (err) {
    console.log(err);
    throw err;
  }
  return filePath;
};


