import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, ChevronLeft, Youtube } from 'lucide-react';
import { fetchMovieDetails, getImageUrl, searchYouTubeMovie } from '../services/api';
import ContentRow from '../components/movies/ContentRow';
import LoadingScreen from '../components/common/LoadingScreen';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullMovieId, setFullMovieId] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        setMovie(data);
        
        // Search for full movie on YouTube
        const movieId = await searchYouTubeMovie(
          data.title,
          data.release_date?.split('-')[0]
        );
        setFullMovieId(movieId);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Close trailer when navigating away
  useEffect(() => {
    return () => setShowTrailer(false);
  }, []);

  if (loading) return <LoadingScreen />;

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#E50914]">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error || 'Movie not found'}</p>
          <Link 
            to="/"
            className="bg-[#E50914] text-white px-6 py-2 rounded hover:bg-[#f6121d] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get trailer if available
  const trailer = movie.videos?.results?.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              Close
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin"
              title={`${movie.title} Trailer`}
            ></iframe>
          </div>
        </div>
      )}

      {/* Back button */}
      <Link 
        to="/"
        className="fixed top-20 left-4 z-40 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
      >
        <ChevronLeft size={24} />
      </Link>

      {/* Hero section with backdrop */}
      <div className="relative min-h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#14141499] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative pt-32 container mx-auto px-4 z-10 flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-none">
            <img 
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="rounded-lg shadow-2xl w-56 h-auto mx-auto lg:mx-0"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-gray-400 italic mb-4">{movie.tagline}</p>
            )}

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
              {/* Rating */}
              {movie.vote_average && (
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                  <span>{(movie.vote_average / 10 * 5).toFixed(1)}/5</span>
                </div>
              )}

              {/* Release date */}
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}

              {/* Runtime */}
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              {/* Genres */}
              {movie.genres && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <span 
                      key={genre.id}
                      className="px-2 py-1 bg-gray-800 rounded-md text-xs"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300">{movie.overview}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {fullMovieId ? (
                <a 
                  href={`https://www.youtube.com/watch?v=${fullMovieId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#E50914] text-white px-6 py-3 rounded hover:bg-[#f6121d] transition flex items-center gap-2"
                >
                  <Play size={20} fill="white" />
                  Watch Movie
                </a>
              ) : (
                <button 
                  className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-600 transition flex items-center gap-2 cursor-not-allowed"
                  disabled
                >
                  <Play size={20} fill="white" />
                  Not Available
                </button>
              )}
              
              {trailer && (
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-700 transition flex items-center gap-2"
                >
                  <Youtube size={20} />
                  Watch Trailer
                </button>
              )}
            </div>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="flex overflow-x-auto gap-4 pb-4">
                  {movie.credits.cast.slice(0, 10).map((person: any) => (
                    <div key={person.id} className="flex-none w-24">
                      <img 
                        src={getImageUrl(person.profile_path, 'w185') || 'https://via.placeholder.com/185x278?text=No+Image'}
                        alt={person.name}
                        className="w-24 h-24 object-cover rounded-md mb-1"
                      />
                      <div>
                        <p className="text-sm font-medium truncate">{person.name}</p>
                        <p className="text-xs text-gray-400 truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div className="mt-12">
          <ContentRow title="Similar Movies" items={movie.similar.results} type="movie" />
        </div>
      )}

      {/* Recommendations */}
      {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
        <div className="mt-8">
          <ContentRow title="Recommended" items={movie.recommendations.results} />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;