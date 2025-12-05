import { useState } from 'react'
import Navbar from './components/Navbar'
import UploadSection from './components/UploadSection'

function App() {
  const [userPhoto, setUserPhoto] = useState<File | null>(null)
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) return;
    
    setIsProcessing(true);
    // TODO: Implement backend call
    console.log('Processing try-on with:', userPhoto, clothingPhoto);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Try-on processing started (backend not connected)');
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-64px)] gap-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Virtual Try-On
          </h1>
          <p className="text-base-content/70 text-lg">
            Upload your photo and a clothing item to see how it looks on you!
          </p>
        </div>
        
        <UploadSection 
          userPhoto={userPhoto}
          clothingPhoto={clothingPhoto}
          setUserPhoto={setUserPhoto}
          setClothingPhoto={setClothingPhoto}
        />

        <div className="flex justify-center w-full">
          <button 
            className="btn btn-primary btn-lg px-12"
            onClick={handleTryOn}
            disabled={!userPhoto || !clothingPhoto || isProcessing}
          >
             {isProcessing ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              'Try On Now'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
