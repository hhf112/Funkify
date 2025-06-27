import fs from "fs"
import path from "path"
import {v4 as uuid} from "uuid"

const dirInputs = path.join(__dirname, '../../../inputs');

if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

export const generateInputFile = async (input: string) => {
    const jobID = uuid();
    const input_filename = `${jobID}.txt`;
    const input_filePath = path.join(dirInputs, input_filename);
    await fs.writeFileSync(input_filePath, input);
    return input_filePath;
};

