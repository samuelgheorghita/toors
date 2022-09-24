import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // TODO: change this to a smaller size file. Now is 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("wrong image format"), false);
    }
  },
});
