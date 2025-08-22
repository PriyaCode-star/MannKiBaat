import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';
import { Heart, Lock, Music as MusicIcon, Play, Search, Star, Unlock, X } from 'lucide-react';

const SONG_UNLOCK_COST = 30;

const defaultSongs = [
  { title: 'Sunny Vibes', artist: 'Aura Beats', mood: 'happy', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_5f2b18a5b2.mp3?filename=happy-day-113985.mp3' },
  { title: 'Gentle Rain', artist: 'Calm Lab', mood: 'sad', url: 'https://cdn.pixabay.com/download/audio/2021/10/20/audio_5ca25fbf21.mp3?filename=raining-ambient-ambient-9082.mp3' },
  { title: 'Solo Walk', artist: 'LoFi Night', mood: 'lonely', url: 'https://cdn.pixabay.com/download/audio/2021/11/13/audio_19f402eade.mp3?filename=calm-lofi-ambient-110199.mp3' },
  { title: 'Fire Mode', artist: 'Pump Squad', mood: 'angry', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_6738b02de2.mp3?filename=energetic-rock-111120.mp3' },
  { title: 'Butterflies', artist: 'Soft Hearts', mood: 'romantic', url: 'https://cdn.pixabay.com/download/audio/2021/09/27/audio_1a63df1820.mp3?filename=romantic-ambient-9686.mp3' },
  { title: 'Weekend Hype', artist: 'Neon Wave', mood: 'excited', url: 'https://cdn.pixabay.com/download/audio/2022/03/08/audio_4a799d3c9b.mp3?filename=future-bass-117078.mp3' },
  { title: 'HaHa Hop', artist: 'Fun Tones', mood: 'funny', url: 'https://cdn.pixabay.com/download/audio/2021/10/01/audio_80216d8bd6.mp3?filename=funny-tune-9804.mp3' },
  { title: 'Deep Blue', artist: 'Inner Space', mood: 'depressed', url: 'https://cdn.pixabay.com/download/audio/2021/09/09/audio_4d68a5f6b7.mp3?filename=deep-ambient-8191.mp3' },
];

const Music = () => {
  const { user, spendCoins } = useAuth();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, favorites, locked
  const [currentSong, setCurrentSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Seed songs if empty
  const seedSongsIfEmpty = async () => {
    const snap = await getDocs(collection(db, 'songs'));
    if (snap.empty) {
      for (const s of defaultSongs) {
        await addDoc(collection(db, 'songs'), {
          ...s,
          unlockedBy: [],
          createdAt: new Date(),
        });
      }
    }
  };

  const loadSongs = async () => {
    setIsLoading(true);
    await seedSongsIfEmpty();
    const snapshot = await getDocs(collection(db, 'songs'));
    const data = [];
    snapshot.forEach((d) => data.push({ id: d.id, ...d.data() }));
    setSongs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unlockedSongIds = useMemo(() => {
    if (!user) return new Set();
    return new Set(
      songs
        .filter((s) => (s.unlockedBy || []).includes(user.uid))
        .map((s) => s.id)
    );
  }, [songs, user]);

  const filteredSongs = useMemo(() => {
    const text = search.toLowerCase();
    let list = songs.filter((s) =>
      s.title.toLowerCase().includes(text) || s.artist.toLowerCase().includes(text)
    );

    if (activeTab === 'favorites') {
      list = list.filter((s) => (user?.favorites || []).includes(s.id));
    } else if (activeTab === 'locked') {
      list = list.filter((s) => !unlockedSongIds.has(s.id));
    }

    if (user?.mood) {
      list = list.filter((s) => s.mood === user.mood);
    }

    return list;
  }, [songs, search, activeTab, user, unlockedSongIds]);

  const playSong = (song) => {
    if (!unlockedSongIds.has(song.id)) {
      alert('Unlock the song to play');
      return;
    }
    setCurrentSong(song);
  };

  const toggleFavorite = async (songId) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const isFav = (user.favorites || []).includes(songId);
    await updateDoc(userRef, {
      favorites: isFav ? arrayRemove(songId) : arrayUnion(songId)
    });
    // Optimistic UI update
    if (isFav) {
      user.favorites = (user.favorites || []).filter((id) => id !== songId);
    } else {
      user.favorites = [ ...(user.favorites || []), songId ];
    }
  };

  const unlockSong = async (song) => {
    if (!user) return;
    if (unlockedSongIds.has(song.id)) return;

    try {
      await spendCoins(SONG_UNLOCK_COST);
      const songRef = doc(db, 'songs', song.id);
      await updateDoc(songRef, {
        unlockedBy: arrayUnion(user.uid)
      });
      alert(`Unlocked "${song.title}"!`);
      await loadSongs();
    } catch (e) {
      alert('Insufficient coins. Watch ads to earn more!');
    }
  };

  return (
    <div className="pb-28 px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MusicIcon className="w-6 h-6 mr-2 text-primary-600" />
          Mood Jukebox
        </h2>
        <div className="text-sm text-gray-500">Mood: <span className="font-medium capitalize">{user?.mood || 'any'}</span></div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search songs by name or artist"
          className="input-field pl-10"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'all', label: 'All Songs' },
          { id: 'favorites', label: 'Favorites' },
          { id: 'locked', label: 'Locked' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              activeTab === t.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Songs List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading songs...</div>
        ) : (
          filteredSongs.map((song) => {
            const isUnlocked = unlockedSongIds.has(song.id);
            const isFav = (user?.favorites || []).includes(song.id);
            return (
              <div key={song.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-soft">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-primary-50' : 'bg-gray-100'}`}>
                    {isUnlocked ? <Play className="w-6 h-6 text-primary-600" /> : <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{song.title}</div>
                    <div className="text-sm text-gray-500">{song.artist} • <span className="capitalize">{song.mood}</span></div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(song.id)}
                    className={`p-2 rounded-lg transition-colors ${isFav ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-pink-500' : ''}`} />
                  </button>
                  {isUnlocked ? (
                    <button onClick={() => playSong(song)} className="btn-primary text-sm py-2 px-3">
                      Play
                    </button>
                  ) : (
                    <button onClick={() => unlockSong(song)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-2 px-3 rounded-xl">
                      Unlock 30
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Player */}
      {currentSong && (
        <div className="fixed left-0 right-0 bottom-16 bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">{currentSong.title}</div>
              <div className="text-sm text-gray-500">{currentSong.artist}</div>
            </div>
            <audio src={currentSong.url} controls autoPlay className="w-60" />
            <button onClick={() => setCurrentSong(null)} className="p-2 bg-gray-100 rounded-xl"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Music; 