// // middlewares/multer.js
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // 1. Storage for avatars
// const avatarStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'avatars',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 300, height: 300, crop: 'limit' }],
//   },
// });

// export const uploadAvatar = multer({ storage: avatarStorage });


// // 2. Storage for resumes
// const resumeStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'resumes',
//     resource_type: 'raw', // Important for non-image files!
//     allowed_formats: ['pdf', 'doc', 'docx'],
//     public_id: (req, file) => `resume-${Date.now()}-${file.originalname}`,
//   },
// });

// export const uploadResume = multer({ storage: resumeStorage });
