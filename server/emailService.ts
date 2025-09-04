import nodemailer from 'nodemailer';
import { BookingFormData, BookingQuote } from '../src/types';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other services
    auth: {
      user: process.env.EMAIL_USER || 'info@seven18ny.com',
      pass: process.env.EMAIL_PASS || 'your-app-password' // Use app password for Gmail
    }
  });
};

// Generate email content for booking inquiry
const generateBookingInquiryEmail = (formData: BookingFormData, quoteData: BookingQuote) => {
  const subject = `Event Inquiry - ${formData.eventType} on ${formData.date?.toLocaleDateString()}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Event Inquiry - Seven18NY</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D4AF37; color: #000; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { background: white; padding: 10px; border-radius: 5px; }
        .quote-details { background: #2c2c2c; color: white; padding: 15px; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; }
        .cta-button { 
          display: inline-block; 
          background: #D4AF37; 
          color: #000; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-weight: bold; 
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Event Inquiry</h1>
          <p>Seven18NY Venue Booking</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>📅 Event Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Event Type:</strong><br>
                ${formData.eventType}
              </div>
              <div class="info-item">
                <strong>Date:</strong><br>
                ${formData.date?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div class="info-item">
                <strong>Time:</strong><br>
                ${formData.timeSlot}
              </div>
              <div class="info-item">
                <strong>Guests:</strong><br>
                ${formData.guests} people
              </div>
            </div>
          </div>

          <div class="section">
            <h3>👤 Contact Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Name:</strong><br>
                ${formData.name}
              </div>
              <div class="info-item">
                <strong>Email:</strong><br>
                <a href="mailto:${formData.email}">${formData.email}</a>
              </div>
              <div class="info-item">
                <strong>Phone:</strong><br>
                <a href="tel:${formData.phone}">${formData.phone}</a>
              </div>
              <div class="info-item">
                <strong>Package:</strong><br>
                ${formData.selectedPackage?.name}
              </div>
            </div>
          </div>

          <div class="section">
            <h3>💰 Quote Details</h3>
            <div class="quote-details">
              <p><strong>Package:</strong> ${quoteData.quote.packageName}</p>
              <p><strong>Guest Count:</strong> ${quoteData.quote.guestCount}</p>
              <p><strong>Base Cost:</strong> $${quoteData.quote.baseCost.toFixed(2)}</p>
              ${quoteData.quote.weekendSurcharge > 0 ? 
                `<p><strong>Weekend Surcharge:</strong> $${quoteData.quote.weekendSurcharge.toFixed(2)}</p>` : 
                ''
              }
              <p><strong>Total Estimate:</strong> $${quoteData.quote.totalEstimate.toFixed(2)}</p>
            </div>
          </div>

          ${formData.details ? `
          <div class="section">
            <h3>📝 Additional Details</h3>
            <div class="info-item">
              ${formData.details.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h3>🎯 Customer Intent</h3>
            <p>The customer is interested in discussing:</p>
            <ul>
              <li>Custom package options</li>
              <li>Special requirements</li>
              <li>Pricing negotiations</li>
              <li>Availability confirmation</li>
            </ul>
          </div>

          <div class="section" style="text-align: center;">
            <a href="mailto:${formData.email}" class="cta-button">
              📧 Reply to Customer
            </a>
            <a href="tel:${formData.phone}" class="cta-button">
              📞 Call Customer
            </a>
          </div>
        </div>

        <div class="footer">
          <p>This inquiry was generated from the Seven18NY website booking system.</p>
          <p><strong>Response Time:</strong> Please respond within 24 hours for best customer experience.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Event Inquiry - Seven18NY

Event Details:
- Event Type: ${formData.eventType}
- Date: ${formData.date?.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
- Time: ${formData.timeSlot}
- Number of Guests: ${formData.guests}
- Package: ${formData.selectedPackage?.name}

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}

Quote Details:
- Package: ${quoteData.quote.packageName}
- Guest Count: ${quoteData.quote.guestCount}
- Base Cost: $${quoteData.quote.baseCost.toFixed(2)}
${quoteData.quote.weekendSurcharge > 0 ? `- Weekend Surcharge: $${quoteData.quote.weekendSurcharge.toFixed(2)}` : ''}
- Total Estimate: $${quoteData.quote.totalEstimate.toFixed(2)}

Additional Details:
${formData.details || 'None provided'}

Customer Intent:
The customer is interested in discussing:
- Custom package options
- Special requirements
- Pricing negotiations
- Availability confirmation

Please respond within 24 hours for best customer experience.

---
This inquiry was generated from the Seven18NY website booking system.
  `;

  return { subject, htmlContent, textContent };
};

// Send booking inquiry email
export const sendBookingInquiry = async (formData: BookingFormData, quoteData: BookingQuote) => {
  try {
    const transporter = createTransporter();
    const { subject, htmlContent, textContent } = generateBookingInquiryEmail(formData, quoteData);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'info@seven18ny.com',
      to: process.env.BOOKING_EMAIL || 'info@seven18ny.com',
      subject: subject,
      text: textContent,
      html: htmlContent,
      replyTo: formData.email // Allow direct reply to customer
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'Booking inquiry sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to send booking inquiry'
    };
  }
};

// Send confirmation email to customer
export const sendCustomerConfirmation = async (formData: BookingFormData, quoteData: BookingQuote) => {
  try {
    const transporter = createTransporter();
    
    const subject = `Thank you for your inquiry - Seven18NY Event Booking`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for your inquiry - Seven18NY</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #D4AF37; color: #000; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Thank You for Your Inquiry!</h1>
            <p>Seven18NY - Brooklyn's Premier Event Venue</p>
          </div>
          
          <div class="content">
            <p>Dear ${formData.name},</p>
            
            <p>Thank you for your interest in hosting your <strong>${formData.eventType}</strong> at Seven18NY!</p>
            
            <p>We've received your inquiry for <strong>${formData.date?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</strong> and our team is excited to help make your event unforgettable.</p>
            
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will review your event details within 24 hours</li>
              <li>We'll contact you to discuss custom options and pricing</li>
              <li>We'll help you finalize all the details for your perfect event</li>
            </ul>
            
            <p>If you have any immediate questions, feel free to reach out to us at <a href="mailto:info@seven18ny.com">info@seven18ny.com</a> or call us directly.</p>
            
            <p>We look forward to making your event at Seven18NY absolutely spectacular!</p>
            
            <p>Best regards,<br>
            The Seven18NY Team</p>
          </div>
          
          <div class="footer">
            <p>Seven18NY | Brooklyn's Premier Event Venue</p>
            <p>Black Owned • Woman Led • Brooklyn Born</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'info@seven18ny.com',
      to: formData.email,
      subject: subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'Confirmation email sent successfully'
    };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      message: 'Failed to send confirmation email'
    };
  }
};
