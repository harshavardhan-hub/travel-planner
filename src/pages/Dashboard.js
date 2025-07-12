import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { 
  Plus, 
  LogOut, 
  Heart, 
  Trash2, 
  Filter, 
  Mountain, 
  Coffee, 
  Briefcase,
  Plane,
  Star
} from 'lucide-react';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('adventure');
  const [list, setList] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const navigate = useNavigate();

  const addTrip = async () => {
    if (!title.trim()) {
      alert("Please enter a trip title.");
      return;
    }

    try {
      await addDoc(collection(db, 'itineraries'), {
        title,
        type,
        userId: auth.currentUser.uid,
        favorite: false,
        createdAt: new Date(),
      });
      setTitle('');
      loadTrips();
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Error adding trip. See console.");
    }
  };

  const loadTrips = async () => {
    try {
      const q = query(collection(db, 'itineraries'), where('userId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      setList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error loading trips:", error);
    }
  };

  const toggleFavorite = async (tripId, currentStatus) => {
    try {
      const tripRef = doc(db, 'itineraries', tripId);
      await updateDoc(tripRef, { favorite: !currentStatus });
      loadTrips();
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const deleteTrip = async (tripId) => {
    const confirm = window.confirm("Are you sure you want to delete this trip?");
    if (!confirm) return;

    try {
      const tripRef = doc(db, 'itineraries', tripId);
      await deleteDoc(tripRef);
      loadTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const logout = () => {
    signOut(auth);
    navigate('/login');
  };

  const getTypeIcon = (tripType) => {
    switch (tripType) {
      case 'adventure':
        return <Mountain className="w-5 h-5" />;
      case 'leisure':
        return <Coffee className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Plane className="w-5 h-5" />;
    }
  };

  const getTypeColor = (tripType) => {
    switch (tripType) {
      case 'adventure':
        return 'text-green-600 bg-green-100';
      case 'leisure':
        return 'text-blue-600 bg-blue-100';
      case 'work':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadTrips();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const filteredTrips = list.filter(trip => !showOnlyFavorites || trip.favorite);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Travel Planner
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Add Trip Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Plus className="w-6 h-6 text-purple-600" />
            Plan Your Next Adventure
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white/80 placeholder-gray-500"
                placeholder="Enter your trip destination..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            
            <div className="md:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white/80"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="adventure">🏔️ Adventure</option>
                <option value="leisure">☕ Leisure</option>
                <option value="work">💼 Work</option>
              </select>
            </div>
            
            <button
              onClick={addTrip}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Trip
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            My Trips ({filteredTrips.length})
          </h2>
          
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
              showOnlyFavorites 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg' 
                : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-white'
            }`}
            onClick={() => setShowOnlyFavorites(prev => !prev)}
          >
            <Filter className="w-4 h-4" />
            {showOnlyFavorites ? "Show All" : "Show Favorites"}
          </button>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {showOnlyFavorites ? "No favorite trips yet" : "No trips planned yet"}
            </h3>
            <p className="text-gray-500">
              {showOnlyFavorites 
                ? "Mark some trips as favorites to see them here!" 
                : "Start planning your next adventure by adding a trip above!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => (
              <div
                key={trip.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(trip.type)}`}>
                      {getTypeIcon(trip.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                        {trip.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{trip.type}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
                      trip.favorite 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                    }`}
                    onClick={() => toggleFavorite(trip.id, trip.favorite)}
                  >
                    {trip.favorite ? (
                      <>
                        <Star className="w-4 h-4 fill-current" />
                        Favorite
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>

                  <button
                    className="flex items-center gap-2 bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-all duration-300 font-medium"
                    onClick={() => deleteTrip(trip.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}