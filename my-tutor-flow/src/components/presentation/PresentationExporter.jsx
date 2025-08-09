import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Slideshow as SlideshowIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Presentation Exporter Component
 * Exports hackathon pitch to PDF and PowerPoint formats
 */
const PresentationExporter = ({ slides = [], title = "My Tutor Flow - Solana Mobile Hackathon" }) => {
  const theme = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDialog, setExportDialog] = useState(false);
  const [exportType, setExportType] = useState('');

  // Export to PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportType('PDF');
    setExportDialog(true);

    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Cover page
      pdf.setFontSize(24);
      pdf.setTextColor(16, 185, 129); // Emerald green
      pdf.text('My Tutor Flow', 148, 50, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setTextColor(75, 85, 99);
      pdf.text('Solana Mobile Hackathon Presentation', 148, 70, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text('Mobile-First Education Platform', 148, 90, { align: 'center' });
      
      // Add logo placeholder
      pdf.setFillColor(16, 185, 129);
      pdf.circle(148, 120, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.text('🎓', 148, 125, { align: 'center' });

      // Process each slide
      for (let i = 0; i < slides.length; i++) {
        setExportProgress(((i + 1) / slides.length) * 100);
        
        pdf.addPage();
        
        // Slide header
        pdf.setFontSize(18);
        pdf.setTextColor(16, 185, 129);
        pdf.text(slides[i].title, 20, 30);
        
        pdf.setFontSize(12);
        pdf.setTextColor(75, 85, 99);
        pdf.text(slides[i].subtitle, 20, 45);
        
        // Slide content (simplified text version)
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        const content = getSlideTextContent(slides[i]);
        const lines = pdf.splitTextToSize(content, 250);
        pdf.text(lines, 20, 65);
        
        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(156, 163, 175);
        pdf.text(`Slide ${i + 1} of ${slides.length}`, 20, 200);
        pdf.text('My Tutor Flow - Solana Mobile Hackathon', 200, 200);
      }

      // Save PDF
      pdf.save('My_Tutor_Flow_Hackathon_Pitch.pdf');
      
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportDialog(false);
      }, 1000);

    } catch (error) {
      console.error('PDF export failed:', error);
      setIsExporting(false);
      setExportDialog(false);
    }
  };

  // Export to PowerPoint (HTML format that can be imported)
  const exportToPowerPoint = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportType('PowerPoint');
    setExportDialog(true);

    try {
      let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Tutor Flow - Solana Mobile Hackathon</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8fafc;
        }
        .slide { 
            width: 1024px; 
            height: 768px; 
            margin: 20px auto; 
            padding: 40px; 
            background: white; 
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            page-break-after: always;
            display: flex;
            flex-direction: column;
        }
        .slide-header {
            border-bottom: 3px solid #10B981;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .slide-title { 
            font-size: 36px; 
            font-weight: bold; 
            color: #10B981; 
            margin: 0 0 10px 0;
        }
        .slide-subtitle { 
            font-size: 20px; 
            color: #6B7280; 
            margin: 0;
        }
        .slide-content { 
            flex: 1;
            font-size: 16px; 
            line-height: 1.6;
            color: #374151;
        }
        .slide-footer {
            border-top: 1px solid #E5E7EB;
            padding-top: 15px;
            margin-top: 20px;
            font-size: 12px;
            color: #9CA3AF;
            text-align: center;
        }
        .logo-placeholder {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #10B981, #047857);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
            margin: 20px auto;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .feature-card {
            background: #F0FDF4;
            border: 2px solid #10B981;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .stat-card {
            background: #EFF6FF;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #1E40AF;
        }
        .highlight-box {
            background: linear-gradient(135deg, #10B981, #047857);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
`;

      // Cover slide
      htmlContent += `
<div class="slide">
    <div style="text-align: center; padding: 100px 0;">
        <div class="logo-placeholder">🎓</div>
        <h1 style="font-size: 48px; color: #10B981; margin: 20px 0;">My Tutor Flow</h1>
        <h2 style="font-size: 24px; color: #6B7280; margin: 10px 0;">Solana Mobile Hackathon Presentation</h2>
        <p style="font-size: 18px; color: #9CA3AF;">Mobile-First Education Platform</p>
        <div style="margin-top: 40px;">
            <span style="background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px;">4-Minute Pitch</span>
        </div>
    </div>
</div>
`;

      // Process each slide
      for (let i = 0; i < slides.length; i++) {
        setExportProgress(((i + 1) / slides.length) * 80);
        
        htmlContent += `
<div class="slide">
    <div class="slide-header">
        <h1 class="slide-title">${slides[i].title}</h1>
        <h2 class="slide-subtitle">${slides[i].subtitle}</h2>
    </div>
    <div class="slide-content">
        ${getSlideHTMLContent(slides[i])}
    </div>
    <div class="slide-footer">
        Slide ${i + 1} of ${slides.length} • My Tutor Flow - Solana Mobile Hackathon • ${slides[i].duration}s
    </div>
</div>
`;
      }

      htmlContent += `
</body>
</html>
`;

      // Create and download HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'My_Tutor_Flow_Hackathon_Slides.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportDialog(false);
      }, 1000);

    } catch (error) {
      console.error('PowerPoint export failed:', error);
      setIsExporting(false);
      setExportDialog(false);
    }
  };

  // Get text content for PDF
  const getSlideTextContent = (slide) => {
    switch (slide.id) {
      case 'intro':
        return `My Tutor Flow is a mobile-first education platform designed for the Solana ecosystem.

Key Features:
• Mobile-Native Design - Built for Solana Mobile devices
• Education Focus - Transforming tutoring businesses  
• Crypto-Ready - Future Solana integration

Target Market: 170K+ Solana Mobile users in the $7.8B EdTech market.`;

      case 'problem':
        return `Current Pain Points in Education Technology:

• Desktop-only education platforms
• Complex payment systems
• No real-time mobile analytics
• Scattered administrative tools

Market Opportunity:
• 170K+ Solana Mobile Users
• $7.8B EdTech Market
• 85% Mobile Usage
• 0 Mobile-First Solutions`;

      case 'solution':
        return `"From Scattered Spreadsheets to Streamlined Success"

The first mobile-native education management platform designed for the Solana ecosystem.

Core Features:
• Touch-First UI - Optimized for mobile interactions
• Lightning Fast - Sub-second load times with offline-first architecture
• Crypto-Ready - Built for future Solana wallet integration
• Scalable - From individual tutors to education enterprises`;

      case 'mobile-features':
        return `Mobile-First Features Built for Solana Mobile:

• Mobile Dashboard - Real-time analytics optimized for mobile screens
• Contact Integration - Import students directly from mobile contacts
• One-Tap Billing - Quick invoice generation and payment tracking
• Crypto Integration - Future Solana wallet and payment integration

All features designed with 48px touch targets and offline-first architecture.`;

      case 'demo':
        return `Experience My Tutor Flow in Action:

Live Demo Features:
• Mobile Dashboard - Real-time analytics optimized for mobile screens
• Quick Billing - One-tap invoice generation and payment tracking
• Touch Analytics - Swipe through student progress and insights

Demo URL: http://localhost:3000
Hackathon Pitch: http://localhost:3000/hackathon-pitch`;

      case 'ask':
        return `My Tutor Flow is Ready to Win:

✓ Mobile-Native - Built for Solana Mobile from day one
✓ Market Ready - Addressing real pain points today
✓ Crypto Future - Ready for Solana integration

Let's Transform Education Together

Contact: hello@mytutorflow.com
Demo: mytutorflow.com`;

      default:
        return 'Slide content not available in text format.';
    }
  };

  // Get HTML content for PowerPoint
  const getSlideHTMLContent = (slide) => {
    switch (slide.id) {
      case 'intro':
        return `
<div class="feature-grid">
    <div class="feature-card">
        <h3 style="color: #10B981; margin-bottom: 10px;">📱 Mobile-First</h3>
        <p>Built for Solana Mobile ecosystem</p>
    </div>
    <div class="feature-card">
        <h3 style="color: #10B981; margin-bottom: 10px;">🎓 Education Focus</h3>
        <p>Transforming tutoring businesses</p>
    </div>
    <div class="feature-card">
        <h3 style="color: #10B981; margin-bottom: 10px;">🔗 Crypto-Ready</h3>
        <p>Future Solana integration</p>
    </div>
</div>
`;

      case 'problem':
        return `
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
    <div>
        <h3 style="color: #DC2626; margin-bottom: 20px;">📱 Mobile Education Crisis</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">• Desktop-only education platforms</li>
            <li style="margin-bottom: 10px;">• Complex payment systems</li>
            <li style="margin-bottom: 10px;">• No real-time mobile analytics</li>
            <li style="margin-bottom: 10px;">• Scattered administrative tools</li>
        </ul>
    </div>
    <div>
        <h3 style="color: #1E40AF; margin-bottom: 20px;">📊 Market Opportunity</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">170K+</div>
                <div>Solana Mobile Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$7.8B</div>
                <div>EdTech Market</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">85%</div>
                <div>Mobile Usage</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div>Mobile-First Solutions</div>
            </div>
        </div>
    </div>
</div>
`;

      case 'solution':
        return `
<div class="highlight-box">
    <h2 style="margin-bottom: 20px;">"From Scattered Spreadsheets to Streamlined Success"</h2>
    <p style="font-size: 18px;">The first mobile-native education management platform designed for the Solana ecosystem</p>
</div>

<div class="feature-grid">
    <div class="feature-card">
        <h4 style="color: #10B981;">🎯 Touch-First UI</h4>
        <p>Optimized for mobile interactions with 48px touch targets</p>
    </div>
    <div class="feature-card">
        <h4 style="color: #10B981;">⚡ Lightning Fast</h4>
        <p>Sub-second load times with offline-first architecture</p>
    </div>
    <div class="feature-card">
        <h4 style="color: #10B981;">🔗 Crypto-Ready</h4>
        <p>Built for future Solana wallet integration</p>
    </div>
    <div class="feature-card">
        <h4 style="color: #10B981;">📈 Scalable</h4>
        <p>From individual tutors to education enterprises</p>
    </div>
</div>
`;

      case 'mobile-features':
        return `
<h3 style="color: #10B981; text-align: center; margin-bottom: 30px;">📱 Mobile-First Features</h3>

<div class="feature-grid">
    <div class="feature-card">
        <h4>📊 Mobile Dashboard</h4>
        <p>Real-time analytics optimized for mobile screens with quick action buttons</p>
    </div>
    <div class="feature-card">
        <h4>👥 Contact Integration</h4>
        <p>Import students directly from mobile contacts with one-tap registration</p>
    </div>
    <div class="feature-card">
        <h4>💰 One-Tap Billing</h4>
        <p>Quick invoice generation with multi-currency support and payment tracking</p>
    </div>
    <div class="feature-card">
        <h4>🔗 Crypto Integration</h4>
        <p>Future Solana wallet connectivity and NFT certificate issuance</p>
    </div>
</div>
`;

      case 'demo':
        return `
<div class="highlight-box">
    <h2 style="margin-bottom: 20px;">🎬 Experience My Tutor Flow</h2>
    <p style="font-size: 18px; margin-bottom: 20px;">See the mobile-first education platform in action</p>
    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">
        <strong>Live Demo:</strong> http://localhost:3000<br>
        <strong>Hackathon Pitch:</strong> http://localhost:3000/hackathon-pitch
    </div>
</div>

<div class="feature-grid">
    <div class="feature-card">
        <h4>📱 Mobile Dashboard</h4>
        <p>Real-time analytics optimized for mobile screens</p>
    </div>
    <div class="feature-card">
        <h4>💰 Quick Billing</h4>
        <p>One-tap invoice generation and payment tracking</p>
    </div>
    <div class="feature-card">
        <h4>📊 Touch Analytics</h4>
        <p>Swipe through student progress and insights</p>
    </div>
</div>
`;

      case 'ask':
        return `
<div class="highlight-box">
    <h2 style="margin-bottom: 30px;">🎯 Ready to Win</h2>
    <p style="font-size: 20px; margin-bottom: 30px;">My Tutor Flow is the mobile-first education platform the Solana ecosystem needs</p>
</div>

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
    <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="color: #10B981;">✅ Mobile-Native</h3>
        <p>Built for Solana Mobile from day one</p>
    </div>
    <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="color: #10B981;">✅ Market Ready</h3>
        <p>Addressing real pain points today</p>
    </div>
    <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; text-align: center;">
        <h3 style="color: #10B981;">✅ Crypto Future</h3>
        <p>Ready for Solana integration</p>
    </div>
</div>

<div style="text-align: center; margin-top: 40px;">
    <h3 style="color: #10B981;">Let's Transform Education Together</h3>
    <p><strong>Contact:</strong> hello@mytutorflow.com | <strong>Demo:</strong> mytutorflow.com</p>
</div>
`;

      default:
        return '<p>Slide content not available.</p>';
    }
  };

  return (
    <Box>
      <Card sx={{ backgroundColor: theme.colors.background.primary, mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: theme.colors.text.primary }}>
            📄 Export Presentation
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                backgroundColor: theme.colors.status.error + '10',
                border: `2px solid ${theme.colors.status.error}`,
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PdfIcon sx={{ fontSize: 48, color: theme.colors.status.error, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    PDF Export
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: theme.colors.text.secondary }}>
                    Professional PDF presentation ready for sharing and printing
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PdfIcon />}
                    onClick={exportToPDF}
                    disabled={isExporting}
                    sx={{ backgroundColor: theme.colors.status.error }}
                  >
                    Export to PDF
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={{ 
                backgroundColor: theme.colors.status.warning + '10',
                border: `2px solid ${theme.colors.status.warning}`,
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SlideshowIcon sx={{ fontSize: 48, color: theme.colors.status.warning, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    PowerPoint Export
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: theme.colors.text.secondary }}>
                    HTML slides that can be imported into PowerPoint or Google Slides
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<SlideshowIcon />}
                    onClick={exportToPowerPoint}
                    disabled={isExporting}
                    sx={{ backgroundColor: theme.colors.status.warning }}
                  >
                    Export to Slides
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Exported presentations will include your custom My Tutor Flow logo 
              once you place the logo file at <code>public/assets/logos/My_Tutor_Flow_Logo.png</code>
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Export Progress Dialog */}
      <Dialog open={exportDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Exporting {exportType} Presentation
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress 
            variant="determinate" 
            value={exportProgress} 
            size={80}
            sx={{ mb: 3, color: theme.colors.brand.primary }}
          />
          <Typography variant="h6" sx={{ mb: 2 }}>
            {exportProgress.toFixed(0)}% Complete
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            {exportProgress < 100 ? 'Processing slides...' : 'Export complete!'}
          </Typography>
        </DialogContent>
        {exportProgress >= 100 && (
          <DialogActions>
            <Button 
              onClick={() => setExportDialog(false)}
              variant="contained"
              sx={{ backgroundColor: theme.colors.brand.primary }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default PresentationExporter;
