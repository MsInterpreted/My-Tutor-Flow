import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import InvoiceTemplate from './InvoiceTemplate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicePreview = () => {
  const { theme } = useTheme();

  // Production-ready empty invoice data - no sample/mock data
  const emptyInvoice = {
    id: '',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 0,
    currency: 'ZAR',
    status: 'pending',
    description: '',
    lineItems: [],
  };

  const emptyStudent = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  const companyInfo = {
    name: 'TD Learning Academy',
    address: '123 Education Street',
    city: 'Learning City, LC 12345',
    phone: '(555) 123-4567',
    email: 'info@tdlearningacademy.com',
    website: 'www.tdlearningacademy.com',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      // Find the invoice container element
      const invoiceElement = document.querySelector('[data-invoice-container]');
      if (!invoiceElement) {
        alert('Invoice not found. Please try again.');
        return;
      }

      // Create canvas from the invoice element
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      const fileName = `Invoice_${sampleInvoice.id}_${sampleStudent.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            color: '#2c3e50',
            fontWeight: 700,
            marginBottom: '16px',
            fontSize: '2.5rem',
          }}
        >
          🧾 TD Learning Academy Invoice Preview
        </h1>
        <h2
          style={{
            color: '#3498db',
            fontWeight: 600,
            marginBottom: '24px',
            fontSize: '1.5rem',
          }}
        >
          Featuring Your New Emerald & Gold Logo
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#00796B',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '16px',
            }}
          >
            🖨️ Print Invoice
          </button>
          <button
            onClick={handleDownloadPDF}
            style={{
              backgroundColor: '#00D4AA',
              color: '#000000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: '16px',
            }}
          >
            📄 Download PDF
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Invoice Container */}
      <div
        data-invoice-container
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <InvoiceTemplate
          invoice={emptyInvoice}
          student={emptyStudent}
          companyInfo={companyInfo}
        />
      </div>

      {/* Logo Features Highlight */}
      <div
        style={{
          maxWidth: '800px',
          margin: '40px auto 0',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h3 style={{ color: '#00796B', marginBottom: '20px', fontSize: '1.5rem' }}>
          ✨ New Logo Features on Your Invoice
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎓</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '8px' }}>Geometric Faceted Cap</h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Modern angular design with professional depth
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎀</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '8px' }}>Braided Tassels</h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Sophisticated interwoven gold strands
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💎</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '8px' }}>Emerald & Gold</h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Premium color scheme for luxury positioning
            </p>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✨</div>
            <h4 style={{ color: '#2c3e50', marginBottom: '8px' }}>Fun TDLA Letters</h4>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Creative letter designs with gold accents
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#e8f5e8',
            borderRadius: '12px',
            borderLeft: '4px solid #00796B',
          }}
        >
          <p style={{ color: '#2c3e50', margin: 0, fontWeight: 600 }}>
            🎯 <strong>Professional Impact:</strong> Your new logo positions TD Learning Academy as
            a premium tutoring service, helping you command higher rates and attract
            quality-conscious parents who value educational excellence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
