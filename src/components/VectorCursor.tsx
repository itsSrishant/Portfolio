import { useEffect, useRef, useState } from 'react';

export default function VectorCursor() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];
    const maxParticles = 60;
    
    let mouseX = -1000;
    let mouseY = -1000;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Spawn a new particle on mouse move occasionally
      if (Math.random() > 0.3) {
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 0,
          maxLife: Math.random() * 60 + 40
        });
      }
      
      if (particles.length > maxParticles) {
        particles.shift();
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        const alpha = 1 - (p.life / p.maxLife);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.0, 0, Math.PI * 2);
        // Vibrant Orange RGB: 255, 122, 0
        ctx.fillStyle = `rgba(255, 122, 0, ${alpha * 0.9})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha2 = 1 - (p2.life / p2.maxLife);
            const lineAlpha = Math.min(alpha, alpha2) * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Purple RGB: 155, 48, 255
            ctx.strokeStyle = `rgba(155, 48, 255, ${lineAlpha * 0.85})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 150) {
           const lineAlpha = alpha * (1 - distToMouse / 150);
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouseX, mouseY);
           ctx.strokeStyle = `rgba(255, 122, 0, ${lineAlpha * 0.75})`;
           ctx.lineWidth = 1.5;
           ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none mix-blend-screen"
      style={{ zIndex: 99 }}
      aria-hidden="true"
    />
  );
}
