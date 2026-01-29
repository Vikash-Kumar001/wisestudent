import { Resend } from 'resend';

// Lazy initialization of Resend - only create instance when needed
let resendInstance = null;

const getResendInstance = () => {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

// Retry function for email sending with better error handling
const retryEmailSend = async (emailData, maxRetries = 2, delay = 1000, fallbackToDefault = false) => {
  const resend = getResendInstance();
  
  // Create a copy of emailData to avoid mutating the original
  const emailPayload = { ...emailData };
  
  // If domain verification failed, use default Resend domain
  if (fallbackToDefault) {
    const defaultFrom = 'onboarding@resend.dev';
    console.log(`⚠️ Domain not verified, falling back to default Resend domain: ${defaultFrom}`);
    emailPayload.from = `Wise Student <${defaultFrom}>`;
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await resend.emails.send(emailPayload);
      
      if (error) {
        throw new Error(error.message || 'Resend API error');
      }
      
      return data;
    } catch (err) {
      const isLastAttempt = attempt === maxRetries;
      const errorMessage = err?.message || '';
      const isRateLimitError = errorMessage.includes('rate limit') || errorMessage.includes('429');
      const isDomainNotVerified = errorMessage.includes('domain is not verified') || 
                                  errorMessage.includes('not verified') ||
                                  errorMessage.includes('domain');
      
      // If domain is not verified and we haven't tried the fallback yet, retry with default domain
      if (isDomainNotVerified && !fallbackToDefault && attempt === 1) {
        console.log(`⚠️ Domain verification error detected. Retrying with default Resend domain...`);
        return retryEmailSend(emailData, maxRetries, delay, true);
      }
      
      if (isLastAttempt) {
        throw err;
      }
      
      if (isRateLimitError) {
        // Exponential backoff for rate limits
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        console.log(`⏳ Email send attempt ${attempt} rate limited, retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      } else {
        // For other errors, retry with shorter delay
        console.log(`⏳ Email send attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5;
      }
    }
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error(`❌ Email configuration missing: RESEND_API_KEY not set`);
      console.error(`❌ Environment check - NODE_ENV: ${process.env.NODE_ENV}`);
      throw new Error(`Email service not configured: RESEND_API_KEY environment variable is missing.`);
    }
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    // Warn if using custom domain (might not be verified)
    if (fromEmail !== 'onboarding@resend.dev' && !fromEmail.includes('@resend.dev')) {
      console.log(`ℹ️ Using custom domain: ${fromEmail}. Make sure it's verified in Resend.`);
    }

    const emailData = {
      from: `Wise Student <${fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<p>${text || ''}</p>`,
      ...(text && !html && { text }), // Include text version if no HTML
    };

    const startTime = Date.now();
    const data = await retryEmailSend(emailData);
    const duration = Date.now() - startTime;

    if (process.env.DEBUG_EMAIL === '1') {
      console.log(`📧 Email sent to ${Array.isArray(to) ? to.join(', ') : to} | Subject: ${subject} | ${duration}ms`);
    }

    return data;
  } catch (err) {
    const errorMessage = err?.message || "Unknown error";
    
    console.error("❌ Email send error:", errorMessage);
    console.error("Full error details:", {
      message: err?.message,
      stack: err?.stack
    });
    
    // Provide more specific error messages
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error(`Email rate limit exceeded. Please try again in a few moments.`);
    } else if (errorMessage.includes('RESEND_API_KEY')) {
      throw new Error(`Email service not configured. Please check your RESEND_API_KEY environment variable.`);
    } else if (errorMessage.includes('domain is not verified')) {
      throw new Error(`Domain not verified. Please verify your domain in Resend or remove RESEND_FROM_EMAIL to use the default domain.`);
    } else if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
      throw new Error(`Invalid email configuration: ${errorMessage}`);
    } else {
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }
};

// Keep the old function name for backward compatibility
export const sendMail = sendEmail;
