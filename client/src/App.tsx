import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Virtual Try-On
      </h1>
      <p className="text-gray-700 mb-8">
        Boilerplate setup complete with React, Vite, and Tailwind CSS.
      </p>
      <div className="card bg-white p-6 rounded-lg shadow-md">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
