'use client';

import React, { useState } from 'react';
import { X, Loader2, CheckCircle, Sparkles, Leaf } from 'lucide-react';
import PhotoCapture from './PhotoCapture';

interface PlantIdentificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPlantAdded: () => void;
}

export default function PlantIdentificationModal({ isOpen, onClose, onPlantAdded }: PlantIdentificationModalProps) {
    const [showPhotoCapture, setShowPhotoCapture] = useState(true);
    const [isIdentifying, setIsIdentifying] = useState(false);
    const [identification, setIdentification] = useState<any>(null);
    const [plantName, setPlantName] = useState('');
    const [location, setLocation] = useState('');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handlePhotoCapture = async (imageData: string) => {
        setCapturedImage(imageData);
        setShowPhotoCapture(false);
        setIsIdentifying(true);

        try {
            // Call API to create plant (which will identify it)
            const response = await fetch('/api/plants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageData,
                    name: plantName || undefined,
                    location: location || undefined
                })
            });

            if (!response.ok) throw new Error('Failed to create plant');

            const result = await response.json();
            setIdentification(result.identification);
            setPlantName(result.name);
            setIsIdentifying(false);

            // Auto-close after success
            setTimeout(() => {
                onPlantAdded();
                resetModal();
            }, 2000);
        } catch (error) {
            console.error('Error identifying plant:', error);
            alert('Failed to identify plant. Please try again.');
            setIsIdentifying(false);
            setShowPhotoCapture(true);
        }
    };

    const resetModal = () => {
        setShowPhotoCapture(true);
        setIsIdentifying(false);
        setIdentification(null);
        setPlantName('');
        setLocation('');
        setCapturedImage(null);
        onClose();
    };

    return (
        <>
            {showPhotoCapture ? (
                <PhotoCapture
                    onPhotoCapture={handlePhotoCapture}
                    onCancel={onClose}
                />
            ) : (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="glass-panel rounded-3xl max-w-md w-full p-8 relative overflow-hidden shadow-2xl border border-white/10">
                        {/* Ambient Glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Plant AI</h2>
                            </div>
                            <button
                                onClick={resetModal}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Image Preview */}
                        {capturedImage && (
                            <div className="rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-lg relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={capturedImage}
                                    alt="Plant to identify"
                                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {isIdentifying && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
                                        <div className="text-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse" />
                                                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin relative z-10" />
                                            </div>
                                            <p className="text-white font-medium mt-4 animate-pulse">Analyzing species...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Success State */}
                        {identification && !isIdentifying && (
                            <div className="space-y-6 animate-slide-up relative z-10">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4 animate-bounce-small">
                                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">
                                        {identification.commonName}
                                    </h3>
                                    <p className="text-emerald-400/80 italic font-medium mb-6">
                                        {identification.scientificName}
                                    </p>

                                    <div className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/5 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Confidence Match</span>
                                            <span className="text-sm font-bold text-emerald-400">
                                                {identification.confidence}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${identification.confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 text-left leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                        {identification.description}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
                                        <Leaf className="w-4 h-4" />
                                        <span>Plant added to your collection</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
