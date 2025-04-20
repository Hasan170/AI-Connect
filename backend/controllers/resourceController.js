const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const fs = require('fs');

// Upload new resource
exports.uploadResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, type, subject, description, uploadedById, uploadedByName } = req.body;

    // Create resource document
    const resource = new Resource({
      title,
      type,
      subject,
      description,
      uploadedBy: uploadedById,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      duration: req.body.duration || null,
      downloadCount: 0,
      viewCount: 0
    });

    await resource.save();
    
    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource
    });
    
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const { title, type, subject, description } = req.body;
    
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, type, subject, description },
      { new: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Delete file from storage if it exists
    if (resource.filePath && fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath);
    }
    
    await Resource.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment download count
exports.incrementDownloadCount = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json({ downloadCount: resource.downloadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment view count
exports.incrementViewCount = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json({ viewCount: resource.viewCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};