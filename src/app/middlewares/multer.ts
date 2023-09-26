import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploader = multer({
  storage: storage,
});

export default uploader;
