"use client";

import React, { useEffect, useRef } from 'react';

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    
    // Configuration
    const numberOfParticles = 120; // Adjust for density
    const baseColor = 'rgba(10, 74, 43, 0.4)'; // Dim green
    const activeColor = 'rgba(0, 223, 129, 0.9)'; // Jewel emerald
    const connectionDistance = 150;
    const mouseInfluenceDistance = 200;

    // Mouse coordinates
    let mouse = {
      x: -1000,
      y: -1000,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resize);
    
    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1;
        this.density = (Math.random() * 30) + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
      }

      update() {
        // Slow drifting
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > (canvas?.width || 0)) this.vx *= -1;
        if (this.y < 0 || this.y > (canvas?.height || 0)) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        
        // Check distance to mouse to determine if it should "light up"
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let currentColor = baseColor;
        let currentSize = this.size;

        if (distance < mouseInfluenceDistance) {
          currentColor = activeColor;
          currentSize = this.size * 2; // Swell when active
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00df81';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connect = () => {
      if (!ctx) return;
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Check if either node is influenced by mouse
            const distMouseA = Math.sqrt(Math.pow(mouse.x - particlesArray[a].x, 2) + Math.pow(mouse.y - particlesArray[a].y, 2));
            const distMouseB = Math.sqrt(Math.pow(mouse.x - particlesArray[b].x, 2) + Math.pow(mouse.y - particlesArray[b].y, 2));
            
            const isNearMouse = distMouseA < mouseInfluenceDistance || distMouseB < mouseInfluenceDistance;
            
            if (isNearMouse) {
              opacityValue = 1 - (distance / connectionDistance);
              ctx.strokeStyle = `rgba(0, 223, 129, ${opacityValue})`;
              ctx.lineWidth = 1.5;
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#00df81';
            } else {
              opacityValue = 0.2 * (1 - (distance / connectionDistance));
              ctx.strokeStyle = `rgba(10, 74, 43, ${opacityValue})`;
              ctx.lineWidth = 0.5;
              ctx.shadowBlur = 0;
            }

            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // We use composite operation for a nice glowing additive effect
      ctx.globalCompositeOperation = 'lighter';
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Keep it securely behind everything
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    />
  );
}
