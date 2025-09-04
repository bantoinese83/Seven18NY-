import { BookingFormData, BookingQuote } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    inquiryMessageId: string;
    confirmationMessageId: string;
    timestamp: string;
  };
}

export const sendBookingInquiry = async (
  formData: BookingFormData, 
  quoteData: BookingQuote
): Promise<EmailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/booking/inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        quoteData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Error sending booking inquiry:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send booking inquiry'
    };
  }
};

// Health check for the email service
export const checkEmailServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Email service health check failed:', error);
    return false;
  }
};
