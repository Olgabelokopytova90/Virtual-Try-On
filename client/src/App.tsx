import { useState } from 'react'
import Navbar from './components/Navbar'
import UploadSection from './components/UploadSection'
import ProcessingModal, { type ProcessingStep } from './components/ProcessingModal'
import Gallery from './components/Gallery'
import { uploadImage, createTryOnSession } from './services/api'

function App() {
  const [view, setView] = useState<'home' | 'gallery'>('home')
  const [userPhoto, setUserPhoto] = useState<File | null>(null)
  const [existingUserPhotoUrl, setExistingUserPhotoUrl] = useState<string | null>(null)
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null)
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle')
  const [error, setError] = useState<string | undefined>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentSession, setCurrentSession] = useState<any>(null)

  const handleTryOn = async () => {
    if ((!userPhoto && !existingUserPhotoUrl) || !clothingPhoto) return;
    
    setProcessingStep('uploading');
    setError(undefined);

    try {
      // 1. Upload Photos
      let userImageUrl = existingUserPhotoUrl;
      
      if (userPhoto) {
          userImageUrl = await uploadImage(userPhoto, 'user');
          setExistingUserPhotoUrl(userImageUrl); // Save for next time
      }

      if (!userImageUrl) throw new Error("No user image available");

      const clothingImageUrl = await uploadImage(clothingPhoto, 'clothing');
      
      setProcessingStep('processing');
      
      // 2. Create Try-On Session
      const session = await createTryOnSession(userImageUrl, [clothingImageUrl]);
      setCurrentSession(session);

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
  }

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar onNavigate={setView} currentView={view} />
      
      <ProcessingModal 
        step={processingStep} 
        error={error} 
        onClose={handleCloseModal} 
      />

      {view === 'gallery' ? (
        <Gallery />
      ) : (
        <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-64px)] gap-8">
        {currentSession && currentSession.resultImageUrl ? (
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <h2 className="text-3xl font-bold">Your Result</h2>
            <div className="card bg-base-100 shadow-xl overflow-hidden w-full">
               <figure>
                  <img 
                    src={getImageUrl(currentSession.resultImageUrl)} 
                    alt="Virtual Try On Result"
                    className='w-full h-auto object-cover' 
                  />
               </figure>
            </div>
            <button 
              className="btn btn-outline btn-primary"
              onClick={() => {
                setCurrentSession(null);
                setUserPhoto(null);
                setClothingPhoto(null);
              }}
            >
              Try Another Outfit
            </button>
          </div>

        ): (
          <>

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
            existingUserPhotoUrl={existingUserPhotoUrl}
            clothingPhoto={clothingPhoto}
            setUserPhoto={setUserPhoto}
            setClothingPhoto={setClothingPhoto}
          />

          <div className="flex justify-center w-full">
            <button 
              className="btn btn-primary btn-lg px-12"
              onClick={handleTryOn}
              disabled={(!userPhoto && !existingUserPhotoUrl) || !clothingPhoto || processingStep !== 'idle'}
            >
              Try On Now
            </button>
          </div>
          </>
        )}
      </div>
      )}
    </div>
  )
}

export default App
