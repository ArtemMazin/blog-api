import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  destination: 'uploads/', // Путь для сохранения загруженных файлов
};

export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, multerConfig.destination);
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = `${Date.now()}${fileExtension}`;
      cb(null, fileName);
    },
  }),
};
