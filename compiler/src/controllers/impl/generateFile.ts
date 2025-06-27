import fs from "fs"
import path from "path"
import {v4 as uuid} from "uuid"

const dirCodes = path.join(__dirname, '../../../codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

export const generateFile = async (format: string, content: string) => {
    const jobID = uuid();
    const filename = `${jobID}.${format}`;
    const filePath = path.join(dirCodes, filename);
    await fs.writeFileSync(filePath, content);
    return filePath;
};

