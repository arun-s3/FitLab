import imageCompression from 'browser-image-compression';

export const handleImageCompression = async (file) => {
    const options = {
        maxSizeMB: 2,         
        maxWidthOrHeight: 1024, 
    }
    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile
    } catch (error) {
        console.error(error)
    }
}