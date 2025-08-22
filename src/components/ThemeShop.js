import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Palette, Check, Eye } from 'lucide-react';

const THEME_COST = 50;

const defaultThemes = [
  { name: 'Chocolate', previewUrl: '', colors: ['#3E2723','#795548','#A1887F'] },
  { name: 'Ocean Blue', previewUrl: '', colors: ['#0ea5e9','#0369a1','#075985'] },
  { name: 'Sunset', previewUrl: '', colors: ['#fb7185','#f97316','#fde047'] },
  { name: 'Forest', previewUrl: '', colors: ['#16a34a','#22c55e','#065f46'] },
  { name: 'Lavender', previewUrl: '', colors: ['#a78bfa','#c084fc','#7c3aed'] },
  { name: 'Rosy', previewUrl: '', colors: ['#f472b6','#fb7185','#db2777'] },
  { name: 'Slate', previewUrl: '', colors: ['#64748b','#475569','#0f172a'] },
  { name: 'Neon', previewUrl: '', colors: ['#22d3ee','#f59e0b','#84cc16'] },
  { name: 'Midnight', previewUrl: '', colors: ['#111827','#1f2937','#374151'] },
  { name: 'Ghibli', previewUrl: '', colors: ['#93c5fd','#86efac','#f9a8d4'] },
];

const ThemeShop = () => {
  const { user, spendCoins } = useAuth();
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('Chocolate');
  const [loading, setLoading] = useState(true);

  const seedThemesIfEmpty = async () => {
    const snap = await getDocs(collection(db, 'themes'));
    if (snap.empty) {
      for (const t of defaultThemes) {
        await addDoc(collection(db, 'themes'), {
          ...t,
          cost: THEME_COST,
          createdAt: new Date()
        });
      }
    }
  };

  const loadThemes = async () => {
    setLoading(true);
    await seedThemesIfEmpty();
    const snapshot = await getDocs(collection(db, 'themes'));
    const list = [];
    snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
    setThemes(list);
    setLoading(false);
  };

  useEffect(() => {
    loadThemes();
  }, []);

  const unlockTheme = async (theme) => {
    if (!user) return;
    try {
      await spendCoins(THEME_COST);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        theme: theme.name
      });
      setSelectedTheme(theme.name);
      alert(`Unlocked and applied ${theme.name} theme!`);
    } catch (e) {
      alert('Not enough coins. Watch ads to earn more!');
    }
  };

  return (
    <div className="pb-20 px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Palette className="w-6 h-6 mr-2 text-purple-600" />
          Theme Shop
        </h2>
        <div className="text-sm text-gray-500">Selected: <span className="font-medium">{selectedTheme}</span></div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading themes...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {themes.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl border border-gray-100 shadow-soft bg-white">
              <div className="h-20 w-full rounded-xl overflow-hidden mb-3 flex">
                <div className="flex-1" style={{ background: t.colors[0] }} />
                <div className="flex-1" style={{ background: t.colors[1] }} />
                <div className="flex-1" style={{ background: t.colors[2] }} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">Cost: 50 coins</div>
                </div>
                <button
                  onClick={() => unlockTheme(t)}
                  className="btn-primary text-sm py-2 px-3"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeShop; 