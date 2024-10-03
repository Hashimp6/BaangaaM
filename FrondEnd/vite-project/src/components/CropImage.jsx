import  { useState } from 'react';
import Cropper from 'react-easy-crop';
import PropTypes from 'prop-types';

const CropImage = ({ imageUrl, onCrop, onClose, imageType }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCancel = () => {
   onClose()
    console.log("Cropping cancelled");
  };

  const handleSubmit = () => {
    if (croppedAreaPixels) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        const croppedImage = canvas.toDataURL();
        onCrop(croppedImage);
      
      };
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "80vw", height: "60vh", position: "relative" }}>
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={imageType === 'logo' ? 1 / 1 : 6 / 2} // Dynamically set the aspect ratio
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          cropShape="rect"
          showGrid={true}
        />
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleCancel}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

CropImage.propTypes = {
  imageUrl: PropTypes.string, 
  onCrop: PropTypes.func,
  onClose: PropTypes.func, 
  imageType: PropTypes.oneOf(['logo', 'banner']), 
};

export default CropImage;
