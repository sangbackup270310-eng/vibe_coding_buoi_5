import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-gray-800">
                  Try-on App
                </h1>
                <p className="text-center text-gray-600 mt-4">
                  Welcome to the Try-on virtual try-on application
                </p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
