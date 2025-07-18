import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// Interface for particle settings
interface ParticleSettings {
  particleCount: number;
  color: string;
  minSize: number;
  maxSize: number;
  speed: number;
  linked: boolean;
  linkDistance: number;
  linkWidth: number;
}

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'waves' | 'gradient';
  intensity?: 'light' | 'medium' | 'strong';
  color?: string;
  secondary?: string;
}

/**
 * AnimatedBackground - Beautiful animated background component
 * Creates different background effects that can be used as page backgrounds
 */
const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'particles',
  intensity = 'light',
  color,
  secondary,
}) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Define primary and secondary colors based on props or theme
  const primaryColor = color || theme.palette.primary.main;
  const secondaryColor = secondary || theme.palette.secondary.main;

  // Adjust intensity settings
  const getIntensitySettings = () => {
    switch (intensity) {
      case 'light':
        return {
          particleCount: 30,
          opacity: 0.3,
          size: { min: 1, max: 3 },
          speed: 0.5,
        };
      case 'medium':
        return {
          particleCount: 60,
          opacity: 0.5,
          size: { min: 1, max: 4 },
          speed: 0.8,
        };
      case 'strong':
        return {
          particleCount: 100,
          opacity: 0.7,
          size: { min: 1, max: 5 },
          speed: 1,
        };
      default:
        return {
          particleCount: 30,
          opacity: 0.3,
          size: { min: 1, max: 3 },
          speed: 0.5,
        };
    }
  };

  const settings = getIntensitySettings();

  // Particles animation
  useEffect(() => {
    if (variant !== 'particles' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle settings
    const particleSettings: ParticleSettings = {
      particleCount: settings.particleCount,
      color: primaryColor,
      minSize: settings.size.min,
      maxSize: settings.size.max,
      speed: settings.speed,
      linked: true,
      linkDistance: 120,
      linkWidth: 1,
    };

    // Create particles
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
        this.size =
          Math.random() *
            (particleSettings.maxSize - particleSettings.minSize) +
          particleSettings.minSize;
        this.color = particleSettings.color;
      }

      // Method to draw individual particles
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // Update particle position and handle boundary conditions
      update() {
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX * particleSettings.speed;
        this.y += this.directionY * particleSettings.speed;
        this.draw();
      }
    }

    // Create particle array
    const particles: Particle[] = [];
    const init = () => {
      for (let i = 0; i < particleSettings.particleCount; i++) {
        particles.push(new Particle());
      }
    };
    init();

    // Function to connect nearby particles with lines
    const connect = () => {
      if (!ctx) return;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < particleSettings.linkDistance) {
            ctx.strokeStyle = alpha(
              particleSettings.color,
              1 - distance / particleSettings.linkDistance
            );
            ctx.lineWidth = particleSettings.linkWidth;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }

      if (particleSettings.linked) {
        connect();
      }
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, primaryColor, settings]);

  // Waves animation
  useEffect(() => {
    if (variant !== 'waves' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Wave settings based on intensity
    const waves = Array(3)
      .fill(0)
      .map((_, i) => ({
        frequency: 0.001 * (i + 1) * settings.speed,
        amplitude: 50 * (3 - i) * (settings.opacity * 2),
        offset: Math.random() * 100,
      }));

    let time = 0;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, i) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        // Create wave path
        for (let x = 0; x < canvas.width; x++) {
          const y =
            Math.sin(x * wave.frequency + time + wave.offset) * wave.amplitude +
            canvas.height / 2;
          ctx.lineTo(x, y);
        }

        // Close the path and fill
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(0, alpha(primaryColor, 0.1 * settings.opacity));
        gradient.addColorStop(
          0.5,
          alpha(secondaryColor, 0.05 * settings.opacity)
        );
        gradient.addColorStop(1, alpha(primaryColor, 0.1 * settings.opacity));

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      time += 0.01 * settings.speed;
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [variant, primaryColor, secondaryColor, settings]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        pointerEvents: 'none',
        opacity: settings.opacity,
        ...(variant === 'gradient' && {
          background: `linear-gradient(135deg, 
            ${alpha(primaryColor, 0.1)} 0%, 
            ${alpha(secondaryColor, 0.05)} 50%, 
            ${alpha(primaryColor, 0.1)} 100%)`,
          backgroundSize: '400% 400%',
          animation: 'gradientAnimation 15s ease infinite',
          '@keyframes gradientAnimation': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }),
      }}
    >
      {variant !== 'gradient' && (
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      )}
    </Box>
  );
};

export default AnimatedBackground;
