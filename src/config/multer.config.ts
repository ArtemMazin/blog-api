import { diskStorage } from 'multer';
import { extname } from 'path';

export const articleImageConfig = {
  destination: 'uploads/articles/',
};

export const articleImageOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, articleImageConfig.destination);
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = `article_${Date.now()}${fileExtension}`;
      cb(null, fileName);
    },
  }),
};

export const avatarConfig = {
  destination: 'uploads/avatars/',
};

export const avatarOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, avatarConfig.destination);
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = `avatar_${Date.now()}${fileExtension}`;
      cb(null, fileName);
    },
  }),
};
