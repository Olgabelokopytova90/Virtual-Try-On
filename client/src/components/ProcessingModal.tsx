import React from 'react';

export type ProcessingStep = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

interface ProcessingModalProps {
  step: ProcessingStep;
  error?: string;
  onClose: () => void;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({ step, error, onClose }) => {
  if (step === 'idle') return null;

  const isUploading = step === 'uploading' || step === 'processing' || step === 'success';
  const isProcessing = step === 'processing' || step === 'success';
  const isSuccess = step === 'success';

  return (
    <div className="modal modal-open bg-black/50">
      <div className="modal-box max-w-lg">
        {step === 'error' ? (
          <>
            <h3 className="font-bold text-lg text-error">Error</h3>
            <p className="py-4">{error || 'Something went wrong. Please try again.'}</p>
            <div className="modal-action">
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg text-center mb-6">
              {isSuccess ? 'Result Ready!' : 'Creating Your Look'}
            </h3>
            
            <ul className="steps w-full">
              <li className={`step ${isUploading ? 'step-primary' : ''}`}>Uploading</li>
              <li className={`step ${isProcessing ? 'step-primary' : ''}`}>Processing</li>
              <li className={`step ${isSuccess ? 'step-primary' : ''}`}>Result</li>
            </ul>

            <div className="flex flex-col items-center justify-center py-8 min-h-[150px]">
              {step === 'uploading' && (
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-base-content/70">Uploading your photos...</p>
                </div>
              )}
              
              {step === 'processing' && (
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-bars loading-lg text-secondary"></span>
                  <p className="text-base-content/70">Generating try-on result...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center text-success-content text-3xl">
                    ✓
                  </div>
                  <p className="font-medium">Your virtual try-on is ready!</p>
                </div>
              )}
            </div>

            <div className="modal-action flex justify-center">
               {/* Only show close button when complete or if user wants to cancel (optional) */}
               {isSuccess && (
                 <button className="btn btn-primary px-8" onClick={onClose}>
                   View Result
                 </button>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProcessingModal;

