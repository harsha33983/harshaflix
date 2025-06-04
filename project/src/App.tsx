import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const TVDetails = lazy(() => import('./pages/TVDetails'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShows'));
const Search = lazy(() => import('./pages/Search'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#141414] text-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/movie/:id" element={
                  <ProtectedRoute>
                    <MovieDetails />
                  </ProtectedRoute>
                } />
                <Route path="/tv/:id" element={
                  <ProtectedRoute>
                    <TVDetails />
                  </ProtectedRoute>
                } />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv" element={<TVShows />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;