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
    from: '"Tech Optimum Crew" <hr@techoptimum.org>',
    to: email,
    subject: 'thanks for joining the tech optimum waitlist',
    html: `<div style="background-color: #f9f9f9; padding: 20px; font-family: 'Lucida Sans', 'Lucida Sans Regular', sans-serif;">
    <div style="text-align: center;">
        <img src="https://www.techoptimum.org/text-black-transparent.png" alt="Logo" style="width: 150px; opacity: 0.8;">
    </div>
    <div style="background-color: white; margin: 20px auto; padding: 20px; max-width: 500px; border-radius: 10px; box-shadow: 0 2px 15px rgba(0,0,0,0.1);">
        <h1 style="color: #555; font-size: 18px;">hey ${name},</h1>
        <p style="font-size: 14px; color: #888; line-height: 1.5;">good news! you've made it to the tech optimum waitlist. we're stoked to have you onboard and will buzz you when we launch. till then, keep it cool!</p>
        <p style="font-size: 14px; color: #888; line-height: 1.5;">stay curious and thanks for vibing with us.</p>
        <p style="font-size: 14px; color: #888; line-height: 1.5;"><strong>peace out,</strong><br>the tech optimum crew</p>
    </div>
    <div style="color: #888; font-size: 12px; text-align: center; padding: 20px;">
        <p>tech optimum<br>some place on earth</p>
        <p>for questions, <a href="mailto:team@techoptimum.org" style="color: #666; text-decoration: none;">drop us an email</a></p>
    </div>
</div>
`
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
