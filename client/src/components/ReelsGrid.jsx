import React from 'react';
import { Tag, Zap, Sun, Eye, Repeat, PlayCircle } from 'lucide-react';

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num;
};

const ReelsGrid = ({ reels }) => {
    if (!reels || reels.length === 0) {
        return <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl"><h2 className="text-white">No recent reels found.</h2></div>
    }
    return (
        <div className="bg-gray-900/50 ring-1 ring-white/10 p-6 rounded-2xl">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Recent Reels & AI Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {reels.map(reel => (
                    <div key={reel.id || reel.shortcode} className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
                        <div className="relative">
                            <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(reel.imageUrl)}`} className="w-full h-48 object-cover" alt={reel.caption?.substring(0, 50)} />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-white opacity-80" />
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                           <div className="flex justify-between font-bold text-white text-sm mb-2">
                                <span>▶️ {formatNumber(reel.views)}</span>
                                <span>❤️ {formatNumber(reel.likes)}</span>
                                <span>💬 {formatNumber(reel.comments)}</span>
                           </div>
                           <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-grow">{reel.caption || "No caption available."}</p>
                           {reel.tags && (
                             <div className="text-xs space-y-2 border-t border-gray-700 pt-2 mt-auto">
                                <div className="flex items-center gap-2 text-yellow-400" title="Tags"><Tag size={14} />{reel.tags.join(', ') || 'N/A'}</div>
                                <div className="flex items-center gap-2 text-cyan-400" title="Vibe"><Zap size={14} />{reel.vibe || 'N/A'}</div>
                                {reel.quality && (
                                  <>
                                    <div className="flex items-center gap-2 text-purple-400" title="Lighting"><Sun size={14} />{reel.quality.lighting || 'N/A'}</div>
                                    <div className="flex items-center gap-2 text-pink-400" title="Visual Appeal"><Eye size={14} />{reel.quality.visualAppeal || 'N/A'}</div>
                                    <div className="flex items-center gap-2 text-indigo-400" title="Consistency"><Repeat size={14} />{reel.quality.consistency || 'N/A'}</div>
                                  </>
                                )}
                             </div>
                           )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReelsGrid;