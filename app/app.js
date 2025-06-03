import React, { useState, useEffect } from 'react';
import { Calendar, Smile, Frown, Meh, Heart, Plus, TrendingUp } from 'lucide-react';

const MoodTracker = () => {
  const [entries, setEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: 'excellent', label: 'Excellent', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-green-500', bg: 'bg-green-100' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { value: 'poor', label: 'Poor', icon: Frown, color: 'text-red-500', bg: 'bg-red-100' }
  ];

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = async () => {
    if (!currentMood) return;
    
    setLoading(true);
    
    const newEntry = {
      id: Date.now(),
      mood: currentMood,
      note: note.trim(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    // In a real app, this would be an API call
    setTimeout(() => {
      setEntries(prev => [newEntry, ...prev]);
      setCurrentMood('');
      setNote('');
      setLoading(false);
    }, 500);
  };

  const getMoodIcon = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood : moods[2];
  };

  const getMoodStats = () => {
    const last7Days = entries.slice(0, 7);
    const moodCounts = last7Days.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    );
    
    return { dominantMood, totalEntries: last7Days.length };
  };

  const stats = getMoodStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mood Tracker</h1>
          <p className="text-gray-600">Track your daily emotions and reflect on your journey</p>
        </div>

        {/* Stats Card */}
        {entries.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">Your Week</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
                <div className="text-sm text-gray-600">Entries this week</div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getMoodIcon(stats.dominantMood).bg}`}>
                  {React.createElement(getMoodIcon(stats.dominantMood).icon, { 
                    size: 20, 
                    className: getMoodIcon(stats.dominantMood).color 
                  })}
                  <span className="font-medium text-gray-700">{getMoodIcon(stats.dominantMood).label}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">Dominant mood</div>
              </div>
            </div>
          </div>
        )}

        {/* Add Entry Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling today?</h2>
          
          {/* Mood Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setCurrentMood(mood.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  currentMood === mood.value
                    ? `${mood.bg} border-current ${mood.color}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <mood.icon 
                  size={32} 
                  className={`mx-auto mb-2 ${
                    currentMood === mood.value ? mood.color : 'text-gray-400'
                  }`} 
                />
                <div className={`font-medium ${
                  currentMood === mood.value ? 'text-gray-800' : 'text-gray-600'
                }`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={addEntry}
            disabled={!currentMood || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Plus size={20} />
                Add Entry
              </>
            )}
          </button>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Recent Entries</h2>
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No entries yet</div>
              <div className="text-sm text-gray-500">Add your first mood entry above!</div>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const mood = getMoodIcon(entry.mood);
                return (
                  <div key={entry.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${mood.bg}`}>
                      <mood.icon size={20} className={mood.color} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{mood.label}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                          {new Date(entry.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-gray-600 text-sm">{entry.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
