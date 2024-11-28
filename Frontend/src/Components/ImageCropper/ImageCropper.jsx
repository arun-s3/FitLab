import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import "./ImageCropper.css";
import { getCroppedImg } from "../ImageCropper/ImageCropperUtilities";

const ImageCropper = ({ images, onCropComplete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return

  const onCropCompleteHandler = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  const handleCrop = async () => {
    if (!croppedAreaPixels) {
      console.error("Cropping area not defined yet!")
      return
    }

    const croppedImage = await getCroppedImg(images[currentImageIndex].url, croppedAreaPixels)
    onCropComplete(croppedImage, images[currentImageIndex], currentImageIndex)

    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    } else {
      setModalIsOpen(false)
    }
  };

  return (
    <section>
      {modalIsOpen && (
        <main className="image-cropper-container">
          <div className="image-cropper-content">
            {images[currentImageIndex] && (
              <>
                <div className="cropper-wrapper">
                  <Cropper
                    image={images[currentImageIndex].url}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropCompleteHandler}
                  />
                  <div className="absolute bottom-[-7rem] left-[13%] flex flex-col gap-[1rem]">
                    <div className="controls">
                      <label htmlFor="zoom-range">Zoom:</label>
                      <input
                        type="range"
                        id="zoom-range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                      />
                    </div>
                    <button className="crop-button" onClick={handleCrop}>
                      Crop Image
                    </button>
                  </div>
                </div>
              </>
            )}
            {currentImageIndex < images.length - 1 && (
              <button onClick={() => setCurrentImageIndex(currentImageIndex + 1)}>
                Next Image
              </button>
            )}
          </div>
        </main>
      )}
    </section>
  );
};

export default ImageCropper;
