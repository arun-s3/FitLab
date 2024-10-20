import imageCompression from 'browser-image-compression';

export const handleImageCompression = async (file) => {
    console.log("Inside imageCompressor")
    const options = {
        maxSizeMB: 2,         
        maxWidthOrHeight: 1024, 
    }
    try {
        console.log("Compressing..")
        const compressedFile = await imageCompression(file, options);
        return compressedFile
    } catch (error) {
        console.error('Error during compression:', error)
    }
}