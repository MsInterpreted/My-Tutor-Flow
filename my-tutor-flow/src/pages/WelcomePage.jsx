import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Fade, Slide } from '@mui/material';
import { ArrowForward, School, TrendingUp, People } from '@mui/icons-material';
import { MyTutorFlowLogo } from '../components/branding/MyTutorFlowLogo';
import { useTheme } from '../theme/ThemeContext';

// Background options - you can choose from these 10 options
const backgroundOptions = {
  // Option 1: Floating Geometric Shapes
  geometricShapes: {
    name: "Floating Geometric Shapes",
    component: GeometricShapesBackground
  },
  
  // Option 2: Gradient Wave Animation
  gradientWaves: {
    name: "Gradient Wave Animation", 
    component: GradientWavesBackground
  },
  
  // Option 3: Particle Network
  particleNetwork: {
    name: "Particle Network",
    component: ParticleNetworkBackground
  },
  
  // Option 4: Morphing Blobs
  morphingBlobs: {
    name: "Morphing Blobs",
    component: MorphingBlobsBackground
  },
  
  // Option 5: Digital Grid
  digitalGrid: {
    name: "Digital Grid",
    component: DigitalGridBackground
  },
  
  // Option 6: Floating Orbs
  floatingOrbs: {
    name: "Floating Orbs",
    component: FloatingOrbsBackground
  },
  
  // Option 7: Animated Gradient Mesh
  gradientMesh: {
    name: "Animated Gradient Mesh",
    component: GradientMeshBackground
  },
  
  // Option 8: Ripple Effect
  rippleEffect: {
    name: "Ripple Effect",
    component: RippleEffectBackground
  },
  
  // Option 9: Constellation
  constellation: {
    name: "Constellation",
    component: ConstellationBackground
  },
  
  // Option 10: Liquid Motion
  liquidMotion: {
    name: "Liquid Motion",
    component: LiquidMotionBackground
  }
};

// Set the active background here - change this to test different options
const ACTIVE_BACKGROUND = 'gradientWaves'; // Change this to any key from backgroundOptions

function WelcomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Staggered animations
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowButtons(true), 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleEnterDemo = () => {
    navigate('/dashboard');
  };

  const handleViewShowcase = () => {
    navigate('/bonk-showcase');
  };

  const ActiveBackground = backgroundOptions[ACTIVE_BACKGROUND].component;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
      }}
    >
      {/* Animated Background */}
      <ActiveBackground />
      
      {/* Content Overlay */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Fade in={showContent} timeout={1000}>
          <Box>
            {/* Logo */}
            <Box sx={{ mb: 4 }}>
              <MyTutorFlowLogo size={200} showText={true} />
            </Box>
            
            {/* Welcome Text */}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to the Future
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 400,
                color: 'rgba(255,255,255,0.9)',
                mb: 1,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              of Education Management
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                color: 'rgba(255,255,255,0.8)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Experience the power of AI-driven tutoring management with BONK cryptocurrency integration, 
              built for the Solana Mobile ecosystem.
            </Typography>
          </Box>
        </Fade>

        {/* Action Buttons */}
        <Slide in={showButtons} direction="up" timeout={800}>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleEnterDemo}
              endIcon={<ArrowForward />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Enter Demo
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleViewShowcase}
              endIcon={<School />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              BONK Showcase
            </Button>
          </Box>
        </Slide>

        {/* Feature Highlights */}
        <Fade in={showButtons} timeout={1200}>
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">7+ Students</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">R20K+ Revenue</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
              <School sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2">BONK Integration</Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

// Background Component Placeholders - These will be implemented based on your choice
function GeometricShapesBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          animation: 'float 6s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    />
  );
}

function GradientWavesBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        background: `
          linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%),
          linear-gradient(-45deg, transparent 30%, rgba(118, 75, 162, 0.1) 50%, transparent 70%)
        `,
        animation: 'wave 8s ease-in-out infinite',
        '@keyframes wave': {
          '0%, 100%': { 
            backgroundPosition: '0% 0%, 100% 100%',
            backgroundSize: '200% 200%, 200% 200%'
          },
          '50%': { 
            backgroundPosition: '100% 100%, 0% 0%',
            backgroundSize: '300% 300%, 300% 300%'
          },
        },
      }}
    />
  );
}

// Option 3: Particle Network Background
function ParticleNetworkBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        background: `
          radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 60% 60%, rgba(6, 182, 212, 0.1) 0%, transparent 20%)
        `,
        animation: 'particles 12s linear infinite',
        '@keyframes particles': {
          '0%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 50% 50%' },
          '25%': { backgroundPosition: '25% 25%, 75% 75%, 75% 25%, 25% 75%' },
          '50%': { backgroundPosition: '50% 50%, 50% 50%, 100% 0%, 0% 100%' },
          '75%': { backgroundPosition: '75% 75%, 25% 25%, 25% 75%, 75% 25%' },
          '100%': { backgroundPosition: '100% 100%, 0% 0%, 0% 50%, 100% 50%' },
        },
      }}
    />
  );
}

// Option 4: Morphing Blobs Background
function MorphingBlobsBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'morph 10s ease-in-out infinite',
        },
        '&::before': {
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
          top: '20%',
          left: '10%',
          animationDelay: '0s',
        },
        '&::after': {
          background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))',
          bottom: '20%',
          right: '10%',
          animationDelay: '5s',
        },
        '@keyframes morph': {
          '0%, 100%': {
            borderRadius: '50%',
            transform: 'scale(1) rotate(0deg)',
          },
          '33%': {
            borderRadius: '60% 40% 30% 70%',
            transform: 'scale(1.1) rotate(120deg)',
          },
          '66%': {
            borderRadius: '30% 60% 70% 40%',
            transform: 'scale(0.9) rotate(240deg)',
          },
        },
      }}
    />
  );
}

// Option 5: Digital Grid Background
function DigitalGridBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'grid 15s linear infinite',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)',
        },
        '@keyframes grid': {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '50px 50px, 50px 50px' },
        },
      }}
    />
  );
}

// Option 6: Floating Orbs Background
function FloatingOrbsBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        '& .orb': {
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(1px)',
          animation: 'float 8s ease-in-out infinite',
        },
        '& .orb:nth-of-type(1)': {
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent)',
          top: '20%',
          left: '10%',
          animationDelay: '0s',
        },
        '& .orb:nth-of-type(2)': {
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.2), transparent)',
          top: '60%',
          right: '15%',
          animationDelay: '2s',
        },
        '& .orb:nth-of-type(3)': {
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
          bottom: '30%',
          left: '20%',
          animationDelay: '4s',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-30px) translateX(20px)' },
          '66%': { transform: 'translateY(20px) translateX(-15px)' },
        },
      }}
    >
      <div className="orb"></div>
      <div className="orb"></div>
      <div className="orb"></div>
    </Box>
  );
}

// Option 7: Animated Gradient Mesh Background
function GradientMeshBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        background: `
          radial-gradient(ellipse at top left, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(118, 75, 162, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at bottom left, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, rgba(6, 182, 212, 0.2) 0%, transparent 50%)
        `,
        animation: 'mesh 20s ease-in-out infinite',
        '@keyframes mesh': {
          '0%, 100%': {
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
            backgroundPosition: '0% 0%, 100% 0%, 0% 100%, 100% 100%'
          },
          '25%': {
            backgroundSize: '150% 150%, 80% 80%, 120% 120%, 90% 90%',
            backgroundPosition: '25% 25%, 75% 25%, 25% 75%, 75% 75%'
          },
          '50%': {
            backgroundSize: '80% 80%, 150% 150%, 90% 90%, 120% 120%',
            backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%'
          },
          '75%': {
            backgroundSize: '120% 120%, 90% 90%, 150% 150%, 80% 80%',
            backgroundPosition: '75% 25%, 25% 75%, 75% 25%, 25% 75%'
          },
        },
      }}
    />
  );
}

// Option 8: Ripple Effect Background
function RippleEffectBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          border: '2px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '50%',
          animation: 'ripple 4s linear infinite',
        },
        '&::before': {
          top: '50%',
          left: '30%',
          animationDelay: '0s',
        },
        '&::after': {
          top: '30%',
          right: '30%',
          animationDelay: '2s',
        },
        '@keyframes ripple': {
          '0%': {
            width: '0px',
            height: '0px',
            opacity: 1,
          },
          '100%': {
            width: '300px',
            height: '300px',
            opacity: 0,
            transform: 'translate(-50%, -50%)',
          },
        },
      }}
    />
  );
}

// Option 9: Constellation Background
function ConstellationBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        background: `
          radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(102, 126, 234, 0.4), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(118, 75, 162, 0.3), transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.2), transparent),
          radial-gradient(2px 2px at 160px 30px, rgba(139, 92, 246, 0.4), transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'constellation 25s linear infinite',
        '@keyframes constellation': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200px 100px' },
        },
      }}
    />
  );
}

// Option 10: Liquid Motion Background
function LiquidMotionBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        background: `
          linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          linear-gradient(-45deg, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
          linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: '400% 400%, 400% 400%, 400% 400%',
        animation: 'liquid 18s ease-in-out infinite',
        '@keyframes liquid': {
          '0%, 100%': {
            backgroundPosition: '0% 50%, 100% 50%, 50% 0%',
          },
          '25%': {
            backgroundPosition: '100% 0%, 0% 100%, 100% 100%',
          },
          '50%': {
            backgroundPosition: '50% 100%, 50% 0%, 0% 50%',
          },
          '75%': {
            backgroundPosition: '0% 0%, 100% 100%, 50% 50%',
          },
        },
      }}
    />
  );
}

export default WelcomePage;
