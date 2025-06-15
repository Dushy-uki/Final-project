// export const uploadFileController = async (req, res) => {
//   try {
//     if (!req.file || !req.file.path) {
//       return res.status(400).json({ error: 'File upload failed' });
//     }

//     res.status(200).json({
//       message: 'File uploaded successfully',
//       url: req.file.path, // ✅ Cloudinary URL
//     });
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     res.status(500).json({ error: 'Something went wrong during upload' });
//   }
// };
