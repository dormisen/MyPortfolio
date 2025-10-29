import multer from "multer";

// Store files temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
