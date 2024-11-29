const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const FileTags = require('../models/filetag');
const sequelize = require('../config/db');

// Configure Multer for uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    console.log(file.originalname)
    console.log(file)
    const userId = req.user.id; // Add user_id to filename
    cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });


exports.uploadFile = [
  upload.single('file'),
  async (req, res) => {
    const transaction = await sequelize.transaction(); // Transaction for atomic operations
    try {
      const userId = req.user.id;
      const filePath = req.file?.path;  // Optional chaining to prevent undefined errors
      const { name, tags,fileType } = req.body;
  
      // Ensure file is present
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Save file information
      const file = await File.create(
        {
          userId,
          filePath,
          name: name || req.file.originalname,fileType
        },
        { transaction }
      );
      // Save tags if provided
      if (tags) {
        const tagArray = JSON.parse(tags); // Parse tags from JSON string
        const tagPromises = tagArray.map((tag) =>
          FileTags.create(
            {
              file_id: file.id,
              tag_name: tag,
            },
            { transaction }
          )
        );
        await Promise.all(tagPromises);
      }

      await transaction.commit();
      res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
];


exports.imageclick = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find the file by ID, including its associated tags
    const file = await File.findOne({
      where: { id: fileId },
      include: [
        {
          model: FileTags,
          as: 'fileTags',  // Correct alias from the File model association
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Increment the click count for the file
    file.clickCount = (file.clickCount || 0) + 1; // Ensure clickCount exists before incrementing
    await file.save();

    // Return the file data including updated click count
    res.json({
      imageUrl: `http://localhost:3000/${file.filePath}`,
      // Include file tags if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the click' });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await File.findAll({
      where: { userId },
      include: [
        {
          model: FileTags,
          as: 'fileTags', // Correct alias from the File model association
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
