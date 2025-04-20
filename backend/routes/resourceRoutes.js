const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
  uploadResource, 
  getAllResources, 
  getResourceById, 
  updateResource, 
  deleteResource,
  incrementDownloadCount,
  incrementViewCount
} = require('../controllers/resourceController');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    const dir = path.join(__dirname, '../uploads/resources');
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

const router = express.Router();

// Routes
router.post('/upload', upload.single('file'), uploadResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
router.put('/:id/download', incrementDownloadCount);
router.put('/:id/view', incrementViewCount);

module.exports = router;