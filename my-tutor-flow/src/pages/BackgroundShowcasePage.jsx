import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CardActions } from '@mui/material';
import { MyTutorFlowLogo } from '../components/branding/MyTutorFlowLogo';
import { useTheme } from '../theme/ThemeContext';

// Import all background components from WelcomePage
const backgroundOptions = [
  {
    id: 'geometricShapes',
    name: 'Geometric Shapes',
    description: 'Floating geometric elements with gentle movement',
    component: GeometricShapesBackground
  },
  {
    id: 'gradientWaves',
    name: 'Gradient Waves',
    description: 'Diagonal gradient waves that shift and move',
    component: GradientWavesBackground
  },
  {
    id: 'particleNetwork',
    name: 'Particle Network',
    description: 'Connected particle system simulation',
    component: ParticleNetworkBackground
  },
  {
    id: 'morphingBlobs',
    name: 'Morphing Blobs',
    description: 'Organic blob shapes that morph and rotate',
    component: MorphingBlobsBackground
  },
  {
    id: 'digitalGrid',
    name: 'Digital Grid',
    description: 'Animated grid lines with tech aesthetic',
    component: DigitalGridBackground
  },
  {
    id: 'floatingOrbs',
    name: 'Floating Orbs',
    description: 'Multiple floating orb elements',
    component: FloatingOrbsBackground
  },
  {
    id: 'gradientMesh',
    name: 'Gradient Mesh',
    description: 'Complex gradient mesh that shifts',
    component: GradientMeshBackground
  },
  {
    id: 'rippleEffect',
    name: 'Ripple Effect',
    description: 'Expanding ripple circles',
    component: RippleEffectBackground
  },
  {
    id: 'constellation',
    name: 'Constellation',
    description: 'Star field with moving constellation',
    component: ConstellationBackground
  },
  {
    id: 'liquidMotion',
    name: 'Liquid Motion',
    description: 'Fluid liquid-like gradient movement',
    component: LiquidMotionBackground
  }
];

function BackgroundShowcasePage() {
  const theme = useTheme();
  const [selectedBackground, setSelectedBackground] = useState(null);

  const handleSelectBackground = (backgroundId) => {
    setSelectedBackground(backgroundId);
    // You can add logic here to update the WelcomePage background
    alert(`Selected: ${backgroundOptions.find(bg => bg.id === backgroundId)?.name}\n\nTo activate this background, update the ACTIVE_BACKGROUND constant in WelcomePage.jsx to '${backgroundId}'`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.colors.background.primary, py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <MyTutorFlowLogo size={120} showText={true} />
          <Typography variant="h3" sx={{ mt: 3, mb: 2, color: theme.colors.text.primary }}>
            Choose Your Welcome Page Background
          </Typography>
          <Typography variant="h6" sx={{ color: theme.colors.text.secondary, maxWidth: '600px', mx: 'auto' }}>
            Select from 10 stunning animated backgrounds for your hackathon demo
          </Typography>
        </Box>

        {/* Background Options Grid */}
        <Grid container spacing={3}>
          {backgroundOptions.map((option) => (
            <Grid item xs={12} sm={6} md={4} key={option.id}>
              <Card 
                sx={{ 
                  height: '400px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  },
                  border: selectedBackground === option.id ? `3px solid ${theme.colors.primary}` : 'none',
                }}
                onClick={() => handleSelectBackground(option.id)}
              >
                {/* Background Preview */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '280px',
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                    overflow: 'hidden',
                  }}
                >
                  <option.component />
                  
                  {/* Mini Logo Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                    }}
                  >
                    <MyTutorFlowLogo size={60} showText={false} />
                  </Box>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {option.description}
                  </Typography>
                </CardContent>

                {/* Selection Indicator */}
                {selectedBackground === option.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: theme.colors.primary,
                      color: 'white',
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      zIndex: 3,
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Instructions */}
        <Box sx={{ mt: 6, textAlign: 'center', p: 4, backgroundColor: theme.colors.background.secondary, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ mb: 2, color: theme.colors.text.primary }}>
            How to Apply Your Choice
          </Typography>
          <Typography variant="body1" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
            Click on any background above to see the selection. To activate it on your welcome page:
          </Typography>
          <Box sx={{ textAlign: 'left', maxWidth: '600px', mx: 'auto' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
              1. Open: my-tutor-flow/src/pages/WelcomePage.jsx<br/>
              2. Find line 44: const ACTIVE_BACKGROUND = 'gradientWaves';<br/>
              3. Replace 'gradientWaves' with your chosen background ID<br/>
              4. Save and rebuild: npm run build<br/>
              5. Redeploy: npx surge dist my-tutor-flow-hackathon.surge.sh
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Background Components (copied from WelcomePage)
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
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          filter: 'blur(20px)',
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
        backgroundSize: '25px 25px',
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
          '100%': { backgroundPosition: '25px 25px, 25px 25px' },
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
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3), transparent)',
          top: '20%',
          left: '10%',
          animationDelay: '0s',
        },
        '& .orb:nth-of-type(2)': {
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.2), transparent)',
          top: '60%',
          right: '15%',
          animationDelay: '2s',
        },
        '& .orb:nth-of-type(3)': {
          width: '30px',
          height: '30px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
          bottom: '30%',
          left: '20%',
          animationDelay: '4s',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-15px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-8px)' },
        },
      }}
    >
      <div className="orb"></div>
      <div className="orb"></div>
      <div className="orb"></div>
    </Box>
  );
}

// Option 7: Gradient Mesh Background
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
            width: '150px',
            height: '150px',
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

// Option 10: Liquid Motion Background - Emerald Green & Gold Theme
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
          linear-gradient(45deg, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
          linear-gradient(-45deg, rgba(255, 215, 0, 0.12) 0%, transparent 50%),
          linear-gradient(90deg, rgba(5, 150, 105, 0.18) 0%, transparent 50%),
          linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: '400% 400%, 350% 350%, 450% 450%, 300% 300%',
        animation: 'emeraldGoldLiquid 20s ease-in-out infinite',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(255, 215, 0, 0.06) 0%, transparent 60%)
          `,
          animation: 'emeraldGoldOrbs 15s ease-in-out infinite reverse',
        },
        '@keyframes emeraldGoldLiquid': {
          '0%, 100%': {
            backgroundPosition: '0% 50%, 100% 50%, 50% 0%, 100% 100%',
          },
          '25%': {
            backgroundPosition: '100% 0%, 0% 100%, 100% 100%, 0% 0%',
          },
          '50%': {
            backgroundPosition: '50% 100%, 50% 0%, 0% 50%, 50% 50%',
          },
          '75%': {
            backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 100% 0%',
          },
        },
        '@keyframes emeraldGoldOrbs': {
          '0%, 100%': {
            backgroundPosition: '20% 30%, 80% 70%',
            backgroundSize: '300% 300%, 250% 250%'
          },
          '33%': {
            backgroundPosition: '60% 20%, 40% 80%',
            backgroundSize: '400% 400%, 350% 350%'
          },
          '66%': {
            backgroundPosition: '80% 60%, 20% 40%',
            backgroundSize: '250% 250%, 300% 300%'
          },
        },
      }}
    />
  );
}

export default BackgroundShowcasePage;
