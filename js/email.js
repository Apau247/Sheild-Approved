// EmailJS Integration for Sheild-Approved
// 1. Go to https://www.emailjs.com → Dashboard → Add Service (Gmail/Outlook)
// 2. Add Email Template (Signup/Contact)
// 3. Get SERVICE_ID, PUBLIC_KEY, TEMPLATE_IDs below
// 4. In console: emailjs.init('YOUR_PUBLIC_KEY');

window.initEmailJS = function(serviceId, publicKey) {
  emailjs.init({ publicKey });
  console.log('EmailJS initialized');
};

// Send Contact Form Email (user + admin copy)
window.sendContactEmail = async function(payload, templateId, serviceId) {
  try {
    const params = {
      from_name: payload.name || 'Visitor',
      from_email: payload.email || 'no-reply@site.com',
      message: payload.message || '',
      to_email: 'admin@ironvaultsecurity.co.uk'  // Your admin email
    };
    await emailjs.send(serviceId, templateId, params);
    console.log('Contact email sent');
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};

// Send Signup Confirmation (user + admin)
window.sendSignupEmail = async function(payload, templateId, serviceId) {
  try {
    const params = {
      fullName: payload.fullName || 'New Client',
      email: payload.email || '',
      phone: payload.phone || '',
      company: payload.company || '',
      needs: payload.needs || '',
      to_admin: 'New signup from ' + payload.fullName
    };
    await emailjs.send(serviceId, templateId, params);
    console.log('Signup email sent');
    return true;
  } catch (error) {
    console.error('Signup email failed:', error);
    return false;
  }
};

// Send Stripe Success Receipt
window.sendPremiumReceipt = async function(sessionId, userEmail, templateId, serviceId) {
  try {
    const params = {
      user_email: userEmail,
      session_id: sessionId,
      subject: 'Premium Security Upgrade Confirmed - Receipt',
      message: 'Thank you for upgrading! Your data is now fully secured with premium features.'
    };
    await emailjs.send(serviceId, templateId, params);
    console.log('Premium receipt sent');
  } catch (error) {
    console.error('Receipt email failed:', error);
  }
};

