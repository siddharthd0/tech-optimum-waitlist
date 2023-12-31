// pages/api/submit.js
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(name, email) {
  const mailOptions = {
    from: '"Tech Optimum Support" <hr@techoptimum.org>',
    to: email,
    subject: 'Thank You for Joining the Tech Optimum Waitlist',
    html: `<div style="background-color: #f9f9f9; padding: 20px; font-family: 'Lucida Sans', 'Lucida Sans Regular', sans-serif;">
    <div style="text-align: center;">
        <img src="https://www.techoptimum.org/text-black-transparent.png" alt="Logo" style="width: 150px; opacity: 0.8;">
    </div>
    <div style="background-color: white; margin: 20px auto; padding: 20px; max-width: 500px; border-radius: 10px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);">
        <h1 style="color: #555; font-size: 18px;">Dear ${name},</h1>
        <p style="font-size: 14px; color: #888; line-height: 1.5;">We're pleased to inform you that you've been added to the Tech Optimum waitlist. We greatly appreciate your interest and will notify you promptly once we launch micro-hackathons.</p>
        <p style="font-size: 14px; color: #888; line-height: 1.5;">In the meantime, we invite you to check out our free coding courses available at <a href="https://dashboard.techoptimum.org" style="color: #4466FF;">https://dashboard.techoptimum.org</a>. We believe in providing quality education, and these courses are a testament to our commitment.</p>
        <p style="font-size: 14px; color: #888; line-height: 1.5;">Thank you for your patience and trust in our platform. Your dedication to advancing in the world of tech is commendable, and we are eager to assist you in your journey.</p>
        <p style="font-size: 14px; color: #888; line-height: 1.5;">Best Regards,<br>The Tech Optimum Team</p>
    </div>
    <div style="color: #888; font-size: 12px; text-align: center; padding: 20px;">
        <p>Tech Optimum, <br> 1350 S Five Mile Road, Boise, Idaho, 83616</p>
        <p>If you have any inquiries, please <a href="mailto:team@techoptimum.org" style="color: #666; text-decoration: none;">contact us</a>.</p>
    </div>
</div>`
  };


  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default async (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required.' });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('waitlist');
  
    // Check if the email already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already added.' });
    }

    await collection.insertOne({ name, email, isPublic: true });
    await sendEmail(name, email); // Send email after adding to the database

    return res.status(200).json({ message: 'Added to waitlist!' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};
