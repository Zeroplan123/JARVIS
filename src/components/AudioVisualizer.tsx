import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  isProcessing: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, isProcessing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [bars, setBars] = useState<number[]>(Array(32).fill(0));

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update bars with random heights when active
      if (isActive || isProcessing) {
        setBars(prev => prev.map(() => 
          Math.random() * (isActive ? 0.8 : 0.4) + (isProcessing ? 0.2 : 0.1)
        ));
      } else {
        setBars(prev => prev.map(bar => Math.max(0, bar - 0.05)));
      }

      // Draw circular visualizer
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 4;
      const barCount = bars.length;
      const angleStep = (Math.PI * 2) / barCount;

      bars.forEach((barHeight, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const barWidth = 2;
        const barLength = barHeight * radius;

        // Calculate bar position
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barLength);
        const y2 = centerY + Math.sin(angle) * (radius + barLength);

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        
        if (isProcessing) {
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)'); // Yellow
          gradient.addColorStop(1, 'rgba(251, 146, 60, 0.4)'); // Orange
        } else if (isActive) {
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)'); // Cyan
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)'); // Blue
        } else {
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)'); // Dim cyan
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)'); // Dim blue
        }

        // Draw bar
        ctx.strokeStyle = gradient;
        ctx.lineWidth = barWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Add glow effect
        if (barHeight > 0.3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = isProcessing ? 'rgba(251, 191, 36, 0.6)' : 'rgba(6, 182, 212, 0.6)';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw pulsing center when active
      if (isActive || isProcessing) {
        const pulseRadius = radius - 10 + Math.sin(Date.now() * 0.003) * 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isProcessing ? 'rgba(251, 191, 36, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isProcessing, bars]);

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '300px', maxHeight: '300px' }}
      />
      
      {/* Overlay effects */}
      {(isActive || isProcessing) && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 rounded-full animate-ping ${
            isProcessing ? 'bg-yellow-400/20' : 'bg-cyan-400/20'
          }`}></div>
        </div>
      )}
      
      {/* Status indicator */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        {isProcessing ? 'Processing...' : isActive ? 'Speaking...' : 'Idle'}
      </div>
    </div>
  );
};
