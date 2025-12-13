import React, { type ChangeEvent } from 'react';

interface UploadSectionProps {
  userPhoto: File | null;
  existingUserPhotoUrl?: string | null;
  clothingPhoto: File | null;
  setUserPhoto: (file: File | null) => void;
  setClothingPhoto: (file: File | null) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  userPhoto,
  existingUserPhotoUrl,
  clothingPhoto,
  setUserPhoto,
  setClothingPhoto,
}) => {
  
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
      {/* User Photo Upload */}
      <div className="card bg-base-100 shadow-xl flex-1">
        <div className="card-body items-center text-center">
          <h2 className="card-title">1. Your Photo</h2>
          <p>Upload a full-body photo of yourself.</p>
          
          <div className="w-full max-w-xs mt-4">
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setUserPhoto)}
            />
          </div>

          {userPhoto ? (
            <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border border-base-300">
              <img 
                src={URL.createObjectURL(userPhoto)} 
                alt="User preview" 
                className="w-full h-full object-contain bg-base-200"
              />
              <button 
                className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
                onClick={() => setUserPhoto(null)}
                aria-label="Remove user photo"
              >
                ✕
              </button>
            </div>
          ) : existingUserPhotoUrl ? (
             <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border border-base-300">
              <img 
                src={getImageUrl(existingUserPhotoUrl)} 
                alt="Previous User preview" 
                className="w-full h-full object-contain bg-base-200"
              />
              <div className="absolute top-2 right-2 badge badge-info">Using previous</div>
            </div>
          ) : (
            <div className="mt-4 w-full h-64 rounded-lg border-2 border-dashed border-base-300 flex items-center justify-center bg-base-200 text-base-content/30">
              <span>No image selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Clothing Photo Upload */}
      <div className="card bg-base-100 shadow-xl flex-1">
        <div className="card-body items-center text-center">
          <h2 className="card-title">2. Clothing Photo</h2>
          <p>Upload the clothing item you want to try.</p>
          
          <div className="w-full max-w-xs mt-4">
            <input
              type="file"
              className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setClothingPhoto)}
            />
          </div>

           {clothingPhoto ? (
            <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border border-base-300">
              <img 
                src={URL.createObjectURL(clothingPhoto)} 
                alt="Clothing preview" 
                className="w-full h-full object-contain bg-base-200"
              />
              <button 
                className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
                onClick={() => setClothingPhoto(null)}
                aria-label="Remove clothing photo"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="mt-4 w-full h-64 rounded-lg border-2 border-dashed border-base-300 flex items-center justify-center bg-base-200 text-base-content/30">
              <span>No image selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;

