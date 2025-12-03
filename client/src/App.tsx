import { useState } from 'react'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-64px)]">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Virtual Try-On
        </h1>
        <p className="text-base-content/70 mb-8">
          Boilerplate setup complete with React, Vite, Tailwind CSS, and DaisyUI.
        </p>
        <div className="card bg-base-100 shadow-xl w-96">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Counter Test</h2>
            <p>Click the button to test interactivity.</p>
            <div className="card-actions justify-end">
              <button 
                className="btn btn-primary"
                onClick={() => setCount((count) => count + 1)}
              >
                count is {count}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
