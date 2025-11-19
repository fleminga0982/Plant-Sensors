'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Capture Plant Photo</h2>
                        <button
                            onClick={handleCancel}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    {/* Camera View */}
                    {useCamera && !imageData && (
                        <div className="relative rounded-2xl overflow-hidden mb-4 bg-black">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full"
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            <button
                                onClick={capturePhoto}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-emerald-500 hover:border-emerald-400 transition-all shadow-lg"
                            />
                        </div>
                    )}

                    {/* Image Preview */}
                    {imageData && (
                        <div className="relative rounded-2xl overflow-hidden mb-4">
                            <img
                                src={imageData}
                                alt="Captured plant"
                                className="w-full rounded-2xl"
                            />
                        </div>
                    )}

                    {/* Upload Options */}
                    {!imageData && !useCamera && (
                        <div className="space-y-4">
                            <button
                                onClick={startCamera}
                                className="w-full glass rounded-2xl p-6 border-2 border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Camera className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="text-lg font-semibold text-white">Use Camera</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full glass rounded-2xl p-6 border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Upload className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="text-lg font-semibold text-white">Upload Photo</span>
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
                        <div className="flex gap-3">
                            <button
                                onClick={handleRetake}
                                className="flex-1 glass rounded-xl py-3 px-6 border border-white/20 hover:bg-white/10 transition-all text-white font-medium"
                            >
                                Retake
                            </button>
                            <button
                                onClick={handleUsePhoto}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl py-3 px-6 hover:from-emerald-400 hover:to-green-500 transition-all text-white font-medium flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Use Photo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
