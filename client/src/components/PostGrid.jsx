import React from 'react';
import { Tag, Zap, Sun } from 'lucide-react';

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num;
};

const PostGrid = ({ posts, onPostClick }) => {
    if (!posts || posts.length === 0) {
        return <div className="bg-card border border-border p-6 rounded-2xl"><h2 className="text-text-primary">No recent posts found.</h2></div>
    }
    return (
        <div className="bg-card border border-border p-6 rounded-2xl">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Recent Posts & AI Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {posts.map(post => (
                    <div 
                        key={post.id || post.shortcode} 
                        className="bg-background border border-border rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 cursor-pointer"
                        onClick={() => onPostClick(post)}
                    >
                        <img src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(post.imageUrl)}`} className="w-full h-48 object-cover" alt={post.caption?.substring(0, 50)} />
                        <div className="p-4 flex flex-col flex-grow">
                           <div className="flex justify-between font-bold text-text-primary text-sm mb-2">
                                <span>❤️ {formatNumber(post.likes)}</span>
                                <span>💬 {formatNumber(post.comments)}</span>
                           </div>
                           <p className="text-xs text-text-secondary line-clamp-2 mb-3 flex-grow">{post.caption || "No caption available."}</p>
                           {post.tags && (
                             <div className="text-xs space-y-2 border-t border-border pt-2 mt-auto">
                                <div className="flex items-center gap-2">
                                    <span className="tag-badge bg-gray-700 text-gray-300"><Tag size={14} className="inline-block mr-1"/>{post.tags.join(', ') || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="tag-badge bg-gray-700 text-gray-300"><Zap size={14} className="inline-block mr-1"/>{post.vibe || 'N/A'}</span>
                                </div>
                                {post.quality && (
                                  <div className="flex items-center gap-2">
                                    <span className="tag-badge bg-gray-700 text-gray-300"><Sun size={14} className="inline-block mr-1"/>{post.quality.lighting || 'N/A'}</span>
                                  </div>
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

export default PostGrid;