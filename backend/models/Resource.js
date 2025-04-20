const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['document', 'video', 'ebook', 'lab_manual', 'ppt', 'notes'] 
  },
  subject: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  uploadedBy: { 
    type: String,
    required: true 
  },
  fileName: { 
    type: String, 
    required: true 
  },
  filePath: { 
    type: String, 
    required: true 
  },
  fileSize: { 
    type: Number 
  },
  duration: { 
    type: String 
  },
  downloadCount: { 
    type: Number, 
    default: 0 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Resource', resourceSchema);