import { join, extname } from 'path';
import { diskStorage } from 'multer';
import * as dotenv from 'dotenv';

// Загрузка переменных окружения
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Определение корневой директории для загрузок
const uploadRoot =
  process.env.NODE_ENV === 'production'
    ? process.env.UPLOAD_ROOT_PATH
    : join(__dirname, '..', '..', '..', process.env.UPLOAD_ROOT_PATH);

export const articleImageConfig = {
  destination: uploadRoot,
};

export const articleImageOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, articleImageConfig.destination);
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = `articles/article_${Date.now()}${fileExtension}`;
      cb(null, fileName);
    },
  }),
};

export const avatarConfig = {
  destination: uploadRoot,
};

export const avatarOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, avatarConfig.destination);
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = `avatars/avatar_${Date.now()}${fileExtension}`;
      cb(null, fileName);
    },
  }),
};
