import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, ChevronLeft, Youtube } from 'lucide-react';
import { fetchTVDetails, getImageUrl } from '../services/api';
import ContentRow from '../components/movies/ContentRow';
import LoadingScreen from '../components/common/LoadingScreen';

const TVDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchTVDetails(id);
        setShow(data);
      } catch (err) {
        console.error('Error fetching TV show details:', err);
        setError('Failed to load TV show details');
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

  if (error || !show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#E50914]">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error || 'TV show not found'}</p>
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get trailer if available
  const trailer = show.videos?.results?.find(
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
              title={`${show.name} Trailer`}
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
            backgroundImage: `url(${getImageUrl(show.backdrop_path, 'original')})`,
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
              src={getImageUrl(show.poster_path, 'w500')}
              alt={show.name}
              className="rounded-lg shadow-2xl w-56 h-auto mx-auto lg:mx-0"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{show.name}</h1>
            {show.tagline && (
              <p className="text-xl text-gray-400 italic mb-4">{show.tagline}</p>
            )}

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
              {/* Rating */}
              {show.vote_average && (
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                  <span>{(show.vote_average / 10 * 5).toFixed(1)}/5</span>
                </div>
              )}

              {/* First air date */}
              {show.first_air_date && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(show.first_air_date)}</span>
                </div>
              )}

              {/* Number of seasons */}
              {show.number_of_seasons && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                </div>
              )}

              {/* Genres */}
              {show.genres && (
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre: any) => (
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
              <p className="text-gray-300">{show.overview}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button 
                className="bg-[#E50914] text-white px-6 py-3 rounded hover:bg-[#f6121d] transition flex items-center gap-2"
              >
                <Play size={20} fill="white" />
                Play
              </button>
              
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
            {show.credits?.cast && show.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Cast</h2>
                <div className="flex overflow-x-auto gap-4 pb-4">
                  {show.credits.cast.slice(0, 10).map((person: any) => (
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

      {/* Similar Shows */}
      {show.similar?.results && show.similar.results.length > 0 && (
        <div className="mt-12">
          <ContentRow title="Similar Shows" items={show.similar.results} type="tv" />
        </div>
      )}

      {/* Recommendations */}
      {show.recommendations?.results && show.recommendations.results.length > 0 && (
        <div className="mt-8">
          <ContentRow title="Recommended" items={show.recommendations.results} />
        </div>
      )}
    </div>
  );
};

export default TVDetails;