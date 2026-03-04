# Email Setup Instructions

To enable email functionality for the contact form, follow these steps:

## 1. Generate Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Generate an App Password for "Mail" and "Windows Computer"
4. Copy the 16-character password

## 2. Configure Environment Variables

1. Open `.env` in the project root
2. Replace the values:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

## 3. Run the Application

### Option 1: Run both frontend and server together
```bash
npm run dev-full
```

This will start:
- Vite dev server on `http://localhost:5174`
- Email server on `http://localhost:3001`

### Option 2: Run separately in different terminals

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run server
```

## 4. Test the Contact Form

1. Navigate to the Contact section on `http://localhost:5174`
2. Fill in the form with:
   - Title: Your message title
   - Body: Your message content
   - Label: Select a category
3. Click "Submit Issue"
4. The email will be sent to `bibin.blp@gmail.com`

## Notes

- Make sure both servers are running for the email functionality to work
- The app password is specific to Gmail and can be revoked anytime from Google Account settings
- Emails include proper formatting with HTML templates
