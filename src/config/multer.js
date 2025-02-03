import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'node:path';

export default multer({
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (request, file, callback) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            callback(null, uniqueName);
        }
    })
});