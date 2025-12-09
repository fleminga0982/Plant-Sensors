'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check, Aperture, Image as ImageIcon } from 'lucide-react';

interface PhotoCaptureProps {
    onPhotoCapture: (imageData: string) => void;
    onCancel: () => void;
}

export default function PhotoCapture({ onPhotoCapture, onCancel }: PhotoCaptureProps) {
    const [imageData, setImageData] = useState<string | null>(null);
    const [useCamera, setUseCamera] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setUseCamera(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please use file upload instead.');
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                console.log('Captured photo size:', dataUrl.length);
                setImageData(dataUrl);
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setUseCamera(false);
    };

    const handleRetake = () => {
        setImageData(null);
        setUseCamera(false);
    };

    const handleUsePhoto = () => {
        if (imageData) {
            onPhotoCapture(imageData);
        }
    };

    const handleCancel = () => {
        stopCamera();
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-panel rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                {/* Ambient Glow */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="p-8 relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <Camera className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">New Plant Entry</h2>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Camera View */}
                    {useCamera && !imageData && (
                        <div className="relative rounded-2xl overflow-hidden mb-6 bg-black border border-white/10 shadow-lg">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-[400px] object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Camera Overlay */}
                            <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-white/30 rounded-lg" />
                            </div>

                            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                                <button
                                    onClick={capturePhoto}
                                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Image Preview */}
                    {imageData && (
                        <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-lg group">
                            <img
                                src={imageData}
                                alt="Captured plant"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}

                    {/* Upload Options */}
                    {!imageData && !useCamera && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={startCamera}
                                className="group relative overflow-hidden bg-white/5 rounded-2xl p-8 border border-white/5 hover:border-emerald-500/50 transition-all hover:bg-white/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Aperture className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-lg font-bold text-white mb-1">Take Photo</span>
                                        <span className="text-sm text-gray-400">Use your camera</span>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative overflow-hidden bg-white/5 rounded-2xl p-8 border border-white/5 hover:border-blue-500/50 transition-all hover:bg-white/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-lg font-bold text-white mb-1">Upload Image</span>
                                        <span className="text-sm text-gray-400">From your gallery</span>
                                    </div>
                                </div>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    {imageData && (
                        <div className="flex gap-4">
                            <button
                                onClick={handleRetake}
                                className="flex-1 bg-white/5 rounded-xl py-4 px-6 border border-white/10 hover:bg-white/10 transition-all text-white font-medium"
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleUsePhoto}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl py-4 px-6 hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-white font-bold flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Confirm Photo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
