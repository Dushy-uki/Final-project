import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

// Avatar Storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

// Resume Storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'raw', 
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});


const uploadResume = multer({ storage: resumeStorage });

// ✅ Use named exports instead of default
export { uploadAvatar, uploadResume };
