'use client';

import React, { useState } from 'react';
import { X, Loader2, CheckCircle, Camera } from 'lucide-react';
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass rounded-3xl border border-white/20 max-w-md w-full p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Identifying Plant...</h2>
                            <button
                                onClick={resetModal}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Image Preview */}
                        {capturedImage && (
                            <div className="rounded-2xl overflow-hidden mb-6">
                                <img
                                    src={capturedImage}
                                    alt="Plant to identify"
                                    className="w-full"
                                />
                            </div>
                        )}

                        {/* Loading State */}
                        {isIdentifying && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                                <p className="text-gray-300 text-center">
                                    Analyzing plant with AI...
                                </p>
                            </div>
                        )}

                        {/* Success State */}
                        {identification && !isIdentifying && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center justify-center mb-4">
                                    <CheckCircle className="w-16 h-16 text-green-400" />
                                </div>

                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {identification.commonName}
                                    </h3>
                                    <p className="text-gray-400 italic mb-4">
                                        {identification.scientificName}
                                    </p>

                                    <div className="glass rounded-xl p-4 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">Confidence</span>
                                            <span className="text-sm font-semibold text-emerald-400">
                                                {identification.confidence}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${identification.confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 text-left">
                                        {identification.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-center text-green-400 font-medium">
                                        ✓ Plant added to your dashboard
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
