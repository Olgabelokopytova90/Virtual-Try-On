import { useState } from 'react'
import Navbar from './components/Navbar'
import UploadSection from './components/UploadSection'
import ProcessingModal, { type ProcessingStep } from './components/ProcessingModal'
import { uploadImage, createTryOnSession } from './services/api'

function App() {
  const [userPhoto, setUserPhoto] = useState<File | null>(null)
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null)
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle')
  const [error, setError] = useState<string | undefined>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentSession, setCurrentSession] = useState<any>(null)

  const handleTryOn = async () => {
    if (!userPhoto || !clothingPhoto) return;
    
    setProcessingStep('uploading');
    setError(undefined);

    try {
      // 1. Upload Photos
      const [userImageUrl, clothingImageUrl] = await Promise.all([
        uploadImage(userPhoto, 'user'),
        uploadImage(clothingPhoto, 'clothing')
      ]);
      
      setProcessingStep('processing');
      
      // 2. Create Try-On Session
      const session = await createTryOnSession(userImageUrl, [clothingImageUrl]);
      setCurrentSession(session);

      // Simulate processing delay since Gemini is not connected yet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStep('success');
      
    } catch (error) {
      console.error('Error during try-on:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to process try-on session');
      }
      setProcessingStep('error');
    }
  }

  const handleCloseModal = () => {
    setProcessingStep('idle');
    // Optionally redirect or show result here
    if (currentSession) {
        console.log('Viewing session:', currentSession.id);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <ProcessingModal 
        step={processingStep} 
        error={error} 
        onClose={handleCloseModal} 
      />

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
            disabled={!userPhoto || !clothingPhoto || processingStep !== 'idle'}
          >
            Try On Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
