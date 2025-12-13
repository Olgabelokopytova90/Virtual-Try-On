import React, { useEffect, useState } from 'react';
import { getAllSessions } from '../services/api';

interface ClothingItem {
  imageUrl: string;
  category?: string;
}

interface Session {
  id: string;
  userImageUrl: string;
  clothingImageUrl: (string | ClothingItem)[];
  resultImageUrl: string | null;
  status: string;
}

const Gallery: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions();
        // Assuming the API returns an array of sessions
        setSessions(data.reverse()); // Show newest first
      } catch (err) {
        setError('Failed to load gallery');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center p-8 text-error">
            {error}
        </div>
    )
  }

  if (sessions.length === 0) {
      return (
          <div className="text-center p-8 text-base-content/50">
              No try-ons yet. Create one!
          </div>
      )
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="aspect-3/4 overflow-hidden relative group">
              {session.resultImageUrl ? (
                 <img
                  src={getImageUrl(session.resultImageUrl)}
                  alt="Try-on Result"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-base-200 flex items-center justify-center">
                    <span className="text-base-content/50">Processing...</span>
                </div>
              )}
             
            </figure>
            <div className="card-body p-4">
                <div className="flex justify-between items-center">
                    <div className="badge badge-outline">{session.status}</div>
                    <span className="text-xs text-base-content/50">ID: {session.id.slice(0, 8)}</span>
                </div>
                
                 {/* Mini previews of inputs */}
                 <div className="flex items-center gap-2 mt-2">
                    {/* User image on the left */}
                    <div className="avatar">
                        <div className="w-16 h-16 rounded bg-base-200 flex items-center justify-center overflow-hidden">
                            {session.userImageUrl ? (
                                <img src={getImageUrl(session.userImageUrl)} alt="User" />
                            ) : (
                                <span className="text-xs text-base-content/30">No Img</span>
                            )}
                        </div>
                    </div>
                    
                    {/* Divider line */}
                    <div className="divider divider-vertical h-full m-0 min-h-12 border-l border-green-300/80"></div>
                    
                    {/* Clothing items on the right */}
                    <div className="flex gap-2 flex-1 flex-wrap">
                     {session.clothingImageUrl.map((url, idx) => {
                        const imageUrl = typeof url === 'string' ? url : url.imageUrl;
                        return (
                            <div key={idx} className="avatar">
                                <div className="w-16 h-16 rounded bg-base-200 flex items-center justify-center overflow-hidden">
                                    {imageUrl ? (
                                        <img src={getImageUrl(imageUrl)} alt="Clothing" />
                                    ) : (
                                        <span className="text-xs text-base-content/30">No Img</span>
                                    )}
                                </div>
                            </div>
                        );
                     })}
                    </div>
                 </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

