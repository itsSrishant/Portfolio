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
    const numStars = 400; // Balanced density (between 200 and 800)

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

    const shootingStars: { x: number; y: number; vx: number; vy: number; length: number; opacity: number }[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update stars
      for (const star of stars) {
        star.alpha += star.delta;
        // Limit max opacity to 0.5 so they don't clash with the text
        if (star.alpha <= 0 || star.alpha >= 0.5) {
          star.delta = -star.delta;
        }

        // Gentle up and down movement
        star.phase += 0.01;
        star.y = star.baseY + Math.sin(star.phase) * 10;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${Math.max(0, Math.min(0.5, star.alpha))})`;
        ctx.fill();
      }

      // Maintain up to 4 active shooting stars to ensure it never feels empty
      if (shootingStars.length < 4 && Math.random() < 0.08) { 
        // Spawn them just slightly off-screen or on the top/right edges so they are visible immediately
        const startX = Math.random() * (width * 1.2); 
        const startY = -Math.random() * 100 - 20; 
        
        const baseSpeed = Math.random() * 15 + 12;
        const vx = -(baseSpeed * (0.8 + Math.random() * 0.4)); // Moves left
        const vy = (baseSpeed * (0.8 + Math.random() * 0.4));  // Moves down

        shootingStars.push({
          x: startX,
          y: startY,
          vx: vx,
          vy: vy,
          length: Math.random() * 200 + 100, 
          opacity: Math.random() * 0.5 + 0.5, 
        });
      }

      // Draw and update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i] as any; // typing workaround for vx/vy
        
        // Calculate end of tail based on velocity vector to keep it aligned with movement
        const speedSq = ss.vx * ss.vx + ss.vy * ss.vy;
        const speed = Math.sqrt(speedSq);
        const dirX = ss.vx / speed;
        const dirY = ss.vy / speed;
        
        const endX = ss.x - (dirX * ss.length);
        const endY = ss.y - (dirY * ss.length);

        // Draw the cinematic tail
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        const gradient = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`); 
        gradient.addColorStop(0.1, `rgba(255, 122, 0, ${ss.opacity * 0.8})`); 
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); 
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5; 
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw the glowing head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(255, 122, 0, 1)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        ss.x += ss.vx;
        ss.y += ss.vy;
        
        // Fade out much slower so they easily cross the entire screen
        ss.opacity -= 0.003; 

        if (ss.opacity <= 0 || ss.x < -200 || ss.y > height + 200) {
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
