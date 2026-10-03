import { useEffect, useRef } from 'react';

export default function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initial stars setup
    const stars: { x: number; y: number; size: number; alpha: number; delta: number; color: string; baseY: number; phase: number }[] = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      const isPurple = Math.random() > 0.8;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseY: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        delta: Math.random() * 0.015 + 0.005,
        color: isPurple ? '180, 100, 255' : '255, 255, 255',
        phase: Math.random() * Math.PI * 2,
      });
    }

    const shootingStars: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update stars
      for (const star of stars) {
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.delta = -star.delta;
        }

        // Gentle up and down movement
        star.phase += 0.01;
        star.y = star.baseY + Math.sin(star.phase) * 10;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.fill();
      }

      // Spawn shooting stars (more of them as requested)
      if (Math.random() < 0.05) { 
        shootingStars.push({
          x: Math.random() * width * 1.5,
          y: Math.random() * height * -0.5,
          length: Math.random() * 100 + 40,
          speed: Math.random() * 8 + 6,
          opacity: 1,
        });
      }

      // Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.length, ss.y + ss.length);
        const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.length, ss.y + ss.length);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ss.x -= ss.speed;
        ss.y += ss.speed;
        ss.opacity -= 0.015;

        if (ss.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, background: 'transparent' }}
      aria-hidden="true"
    />
  );
}
