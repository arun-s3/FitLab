import React, {useState} from 'react';
import ImageCropper from '../../../Components/ImageCropper/ImageCropper';

const AdminImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleCropComplete = (croppedImg, image) => {
    setCroppedImage({...image, url: croppedImg});
    // setSelectedImage(null); 
  };

  return (
    <div>
      <h1>Upload and Crop Product Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedImage && (
        <ImageCropper images={selectedImage} onCropComplete={handleCropComplete} />
      )}
      {croppedImage && (
        <div>
          <h2>Cropped Image</h2>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default AdminImageUpload;
