import React from 'react';
import { X, Heart, MessageCircle, PlayCircle, Tag, Zap, Sun } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const PostModal = ({ item, onClose }) => {
    if (!item) return null;

    const isReel = !!item.views;

    const renderTagsAndVibe = (data) => {
        if (!data || (!data.tags && !data.vibe && !data.quality)) {
            return <p className="text-sm text-text-secondary">AI analysis not available.</p>;
        }
        return (
            <div className="space-y-2">
                {data.tags && data.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Tag size={16} className="text-text-secondary" />
                        <span className="text-text-secondary text-sm">{data.tags.join(', ')}</span>
                    </div>
                )}
                {data.vibe && (
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-text-secondary" />
                        <span className="text-text-secondary text-sm">{data.vibe}</span>
                    </div>
                )}
                {data.quality && data.quality.lighting && (
                    <div className="flex items-center gap-2">
                        <Sun size={16} className="text-text-secondary" />
                        <span className="text-text-secondary text-sm">Lighting: {data.quality.lighting}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative bg-card border border-border rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-text-primary hover:text-white transition-colors p-2 rounded-full bg-background z-10"
                >
                    <X size={24} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
                    <div className="relative flex-shrink-0">
                        <img 
                            src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}`} 
                            alt="Enlarged Post" 
                            className="w-full h-full object-contain rounded-t-xl md:rounded-l-xl md:rounded-tr-none" 
                        />
                        {isReel && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                <PlayCircle className="w-16 h-16 text-white opacity-80" />
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Post Details</h3>

                            <div className="flex flex-col space-y-4 mb-6">
                                <div className="flex items-center gap-4 text-text-primary">
                                    <div className="flex items-center gap-1">
                                        <Heart size={20} className="text-red-400" />
                                        <span>{formatNumber(item.likes)} Likes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageCircle size={20} className="text-blue-400" />
                                        <span>{formatNumber(item.comments)} Comments</span>
                                    </div>
                                    {isReel && (
                                        <div className="flex items-center gap-1">
                                            <PlayCircle size={20} className="text-green-400" />
                                            <span>{formatNumber(item.views)} Views</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-text-secondary uppercase mb-2">Caption</p>
                                <p className="text-white text-base max-h-48 overflow-y-auto pr-2">{item.caption || "No caption available."}</p>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-text-secondary uppercase mb-2">AI Analysis</p>
                                {renderTagsAndVibe(item)}
                            </div>
                        </div>

                        <a 
                            href={item.postUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full text-center mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                        >
                            View on Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;