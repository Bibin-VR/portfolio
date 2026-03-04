import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, title, body, label } = req.body;

  if (!name || !email || !title || !body) {
    return res.status(400).json({ error: 'Name, email, title and body are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${name} via Portfolio" <${process.env.EMAIL_USER}>`,
    to: 'bibin.blp@gmail.com',
    replyTo: `"${name}" <${email}>`,
    subject: `[${label.toUpperCase()}] ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">${title}</h2>
          
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00F0FF; text-decoration: none;">${email}</a></p>
            <p style="margin: 8px 0;"><strong>Label:</strong> <span style="color: #00F0FF; background-color: #001a1a; padding: 4px 8px; border-radius: 4px;">${label}</span></p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">
            ${body.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p style="color: #999; font-size: 12px; margin: 0;">
            Sent from bibinvr.tech contact form.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
}
