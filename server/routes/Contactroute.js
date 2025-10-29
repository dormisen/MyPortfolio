// routes/contact.js
import { Router } from 'express';
const router = Router();
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import 'dotenv/config'

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .escape(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long')
    .escape()
];

// POST contact form
router.post('/', contactValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, email, subject, message } = req.body;

    // Debug log
    console.log('📨 Contact form submission:', { name, email, subject });

    // Create email transporter (use the same config that worked in test)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // ✅ FIXED: Use your email as 'from' but set replyTo to user's email
    const mailOptions = {
      from: {
        name: `${name} (Portfolio Contact)`,
        address: process.env.EMAIL_USER // Use YOUR email here
      },
      replyTo: email, // This allows you to reply directly to the user
      to: email,
      subject: `Portfolio Contact: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          </div>
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
            <strong>Message:</strong>
            <p style="margin-top: 10px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
            <small style="color: #666;">
              This message was sent from your portfolio contact form.
              <br>Click "Reply" to respond directly to ${name}.
            </small>
          </div>
        </div>
      `,
      // Add text version for email clients
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject || 'No Subject'}

Message:
${message}

---
This message was sent from your portfolio contact form.
Click "Reply" to respond directly to ${name}.
      `
    };

    console.log('🔄 Sending notification email...');
    
    // Send email to yourself
    await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent to admin');

    // Also send confirmation to user
    const userMailOptions = {
      from: {
        name: 'Your Portfolio',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4; text-align: center;">Thank You for Reaching Out!</h2>
          <div style="background: #f0fdff; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>I've received your message and will get back to you as soon as possible.</p>
            <p>Here's a copy of your message for reference:</p>
            <div style="background: white; padding: 15px; border-left: 4px solid #06b6d4; margin: 15px 0;">
              <p style="margin: 0; font-style: italic; white-space: pre-line;">${message}</p>
            </div>
            <p>I typically respond within 24-48 hours.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">
              Best regards,<br>
              <strong style="color: #06b6d4;">Rida</strong>
            </p>
          </div>
        </div>
      `,
      text: `
Thank You for Reaching Out!

Hi ${name},

I've received your message and will get back to you as soon as possible.

Here's a copy of your message for reference:
"${message}"

I typically respond within 24-48 hours.

Best regards,
Rida
      `
    };

    await transporter.sendMail(userMailOptions);
    console.log('✅ Confirmation email sent to user');

    res.json({ 
      success: true,
      message: 'Thank you for your message! I will get back to you soon.' 
    });

  } catch (err) {
    console.error('❌ Contact form error:', err);
    
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'There was an error sending your message. Please try again later.'
      : err.message;

    res.status(500).json({ 
      success: false,
      error: errorMessage 
    });
  }
});

export default router;