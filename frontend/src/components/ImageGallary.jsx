import React, { useState, useRef, useEffect, useCallback } from 'react';

const ImageGallary = () => {
  const canvasRef = useRef(null);
  const wheelImageRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);
  const [slideOffset, setSlideOffset] = useState(0);
  const [wheelImageLoaded, setWheelImageLoaded] = useState(false);

  const images = [
    '/images/diary/img1.jpeg',
    '/images/diary/img2.jpeg',
    '/images/diary/img3.jpeg',
    '/images/diary/img4.jpeg',
    '/images/diary/img5.jpeg',
    '/images/diary/img6.jpeg'
  ];

  const wheelImageUrl = '/images/Wheel.svg';

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      wheelImageRef.current = img;
      setWheelImageLoaded(true);
    };
    img.onerror = () => {
      console.warn('Failed to load custom wheel image, using fallback');
      setWheelImageLoaded(false);
    };
    img.src = wheelImageUrl;
  }, [wheelImageUrl]);

  const drawWheel = useCallback((ctx, centerX, centerY, radius, rotation) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    if (wheelImageLoaded && wheelImageRef.current) {
      const size = radius * 2;
      ctx.drawImage(
        wheelImageRef.current,
        -radius,
        -radius,
        size,
        size
      );
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.fillStyle = '#D2691E';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#654321';
      ctx.fill();

      const spokeCount = 8;
      for (let i = 0; i < spokeCount; i++) {
        const angle = (i * Math.PI * 2) / spokeCount;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * radius * 0.2, Math.sin(angle) * radius * 0.2);
        ctx.lineTo(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(Math.cos(angle) * radius * 0.9, Math.sin(angle) * radius * 0.9, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#654321';
        ctx.fill();
      }
    }

    ctx.restore();
  }, [wheelImageLoaded]);

  const getAngleFromPointer = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;
    return Math.atan2(pointerY - centerY, pointerX - centerX);
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;
    const distance = Math.sqrt(Math.pow(pointerX - centerX, 2) + Math.pow(pointerY - centerY, 2));
    const wheelRadius = window.innerWidth < 768 ? 60 : 80;
    if (distance <= wheelRadius) {
      setIsDragging(true);
      setLastAngle(getAngleFromPointer(e, canvas));
    }
  }, [getAngleFromPointer]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const currentAngle = getAngleFromPointer(e, canvas);
    let angleDiff = currentAngle - lastAngle;
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    const newRotation = wheelRotation + angleDiff;
    setWheelRotation(newRotation);
    const rotationPerImage = (Math.PI * 2) / images.length;
    const totalRotations = newRotation / rotationPerImage;
    const newIndex = Math.floor(totalRotations) % images.length;
    const normalizedIndex = newIndex < 0 ? images.length + newIndex : newIndex;
    setCurrentImageIndex(normalizedIndex);
    setSlideOffset((totalRotations % 1) * 100);
    setLastAngle(currentAngle);
  }, [isDragging, lastAngle, wheelRotation, images.length, getAngleFromPointer]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, [isDragging]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const canvasSize = isMobile ? 120 : 160;
    const wheelRadius = isMobile ? 60 : 80;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel(ctx, canvas.width / 2, canvas.height / 2, wheelRadius, wheelRotation);
  }, [wheelRotation, drawWheel, wheelImageLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleDocumentMouseMove = (e) => {
      if (isDragging) {
        handlePointerMove(e);
      }
    };
    
    const handleDocumentMouseUp = (e) => {
      if (isDragging) {
        handlePointerUp(e);
      }
    };
    
    const handleDocumentTouchMove = (e) => {
      if (isDragging) {
        handlePointerMove(e);
      }
    };
    
    const handleDocumentTouchEnd = (e) => {
      if (isDragging) {
        handlePointerUp(e);
      }
    };
    
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    
    if (isDragging) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
      document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false });
      document.addEventListener('touchend', handleDocumentTouchEnd, { passive: false });
    }
    
    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('touchmove', handleDocumentTouchMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, isDragging]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8 tracking-wide">
          Linux Diary 5.0
        </h1>
        <div className="relative mb-8 md:mb-12 bg-transparent backdrop-blur-sm rounded-2xl p-3 md:p-6">
          <div className="relative h-48 md:h-[35vmax] overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-200 ease-out h-full"
              style={{
                transform: `translateX(-${currentImageIndex * 100 + slideOffset}%)`
              }}
            >
              {images.concat(images[0]).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Snow scene ${index + 1}`}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-transparent backdrop-blur-sm rounded-2xl w-full max-w-sm px-4 py-2">
            <div className="flex items-center justify-center space-x-4 relative">
              <img
                src="/images/divider.png"
                alt="golden ornament"
                className="h-6 md:h-[10vh] object-contain"
              />
              <canvas
                ref={canvasRef}
                className="cursor-grab active:cursor-grabbing "
                style={{
                  
                  userSelect: 'none'
                }}
              />
              <img
                src="/images/divider.png"
                alt="golden ornament"
                className="h-6 md:h-[10vh] object-contain transform rotate-180"
              />
              {!wheelImageLoaded && (
                <div className="absolute top-1/2 transform -translate-y-1/2 text-white/50 text-xs">
                  Loading wheel...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallary;