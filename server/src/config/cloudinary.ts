import { v2 as cloudinary } from 'cloudinary';

// Handle missing keys gracefully as instructed in the guidelines
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary initialized successfully.');
} else {
  console.warn(
    'Cloudinary credentials are not defined in environmental variables. Falling back to placeholder and local upload emulation.'
  );
}

// Export pre-configured instance and a safe, non-crash upload helper
export const uploadImageToCloud = async (fileBuffer: Buffer, folder: string = 'kssnn'): Promise<string> => {
  if (!isCloudinaryConfigured) {
    // Return a beautiful general high-res school picture if mock uploading
    const placeHolders = [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    ];
    return placeHolders[Math.floor(Math.random() * placeHolders.length)];
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary Upload Failed, using placeholder:', error);
          resolve('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
};

export { cloudinary };
