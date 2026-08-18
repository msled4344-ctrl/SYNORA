import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { aiRouter } from './routes/ai.js';
import {
  initialHealthTips,
  initialBabyCare,
  initialMedicines,
  initialHealthRatings,
  initialSiteSettings,
} from './data/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory data storage (synchronized with client & persistent in session)
let database = {
  healthTips: [...initialHealthTips],
  babyCare: [...initialBabyCare],
  medicines: [...initialMedicines],
  healthRatings: [...initialHealthRatings],
  siteSettings: { ...initialSiteSettings },
  contacts: [
    {
      id: 'contact-demo-1',
      name: 'Rahim Ahmed',
      email: 'rahim@example.com',
      phone: '+880 1711-223344',
      subject: 'Inquiry regarding Baby Care Vaccination Schedule',
      message: 'Hello SYNORA team, how can I download the vaccination reminder calendar for my 6-month-old infant?',
      status: 'unread',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'contact-demo-2',
      name: 'Dr. Sharmin Akter',
      email: 'sharmin.akter@example.org',
      phone: '+880 1819-556677',
      subject: 'Collaboration with Community Health Clinic',
      message: 'We are very impressed by the SYNORA voice healthcare system. Can we partner for rural health awareness?',
      status: 'resolved',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    }
  ],
  analytics: {
    totalAiQueries: 1420,
    totalBabyCareViews: 865,
    totalMedicineSearches: 2130,
    totalHealthAssessments: 640,
  }
};

// Whitelisted Medical Admin Emails
export const ADMIN_EMAILS = [
  'msled4344@gmail.com',
  'sumonkin523@gmail.com',
  'sumonraja4344@gmail.com',
];

export const isEmailAdmin = (email) => {
  if (!email || typeof email !== 'string') return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
};

// Admin authorization middleware
const requireAdminAuth = (req, res, next) => {
  const userEmail = req.headers['x-user-email'] || req.headers['x-auth-email'];
  if (!userEmail || !isEmailAdmin(userEmail)) {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Unauthorized: Access to this administrative resource is restricted to authorized medical administrators only.',
    });
  }
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'SYNORA AI Healthcare',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// AI Chat Router
app.use('/api/ai', aiRouter);

// Seed API endpoint (to fetch or restore initial comprehensive data)
app.get('/api/seed', (req, res) => {
  res.json({
    healthTips: database.healthTips,
    babyCare: database.babyCare,
    medicines: database.medicines,
    healthRatings: database.healthRatings,
    siteSettings: database.siteSettings,
  });
});

app.post('/api/seed/reset', requireAdminAuth, (req, res) => {
  database.healthTips = [...initialHealthTips];
  database.babyCare = [...initialBabyCare];
  database.medicines = [...initialMedicines];
  database.healthRatings = [...initialHealthRatings];
  database.siteSettings = { ...initialSiteSettings };
  res.json({ message: 'Database reset to default seed data successfully.' });
});

// Analytics & Overview Endpoint for Admin
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  res.json({
    totalUsers: 342,
    activeUsersToday: 58,
    totalAiConsultations: database.analytics.totalAiQueries,
    totalBabyCareViews: database.analytics.totalBabyCareViews,
    totalMedicineLookups: database.analytics.totalMedicineSearches,
    totalHealthAssessments: database.analytics.totalHealthAssessments,
    totalContactMessages: database.contacts.length,
    unreadMessages: database.contacts.filter(c => c.status === 'unread').length,
  });
});

// --- Health Tips APIs ---
app.get('/api/tips', (req, res) => {
  res.json(database.healthTips);
});

app.post('/api/tips', requireAdminAuth, (req, res) => {
  const newTip = {
    id: `tip-${Date.now()}`,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  database.healthTips.unshift(newTip);
  res.status(201).json(newTip);
});

app.put('/api/tips/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = database.healthTips.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Tip not found' });
  database.healthTips[index] = { ...database.healthTips[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(database.healthTips[index]);
});

app.delete('/api/tips/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  database.healthTips = database.healthTips.filter(t => t.id !== id);
  res.json({ success: true, message: 'Health tip deleted' });
});

// --- Baby Care APIs ---
app.get('/api/babycare', (req, res) => {
  database.analytics.totalBabyCareViews += 1;
  res.json(database.babyCare);
});

app.get('/api/babycare/:ageId', (req, res) => {
  const item = database.babyCare.find(b => b.ageId === req.params.ageId);
  if (!item) return res.status(404).json({ error: 'Baby care age bracket not found' });
  res.json(item);
});

app.post('/api/babycare', requireAdminAuth, (req, res) => {
  const newItem = {
    id: `baby-${Date.now()}`,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  database.babyCare.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/babycare/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = database.babyCare.findIndex(b => b.id === id || b.ageId === id);
  if (index === -1) return res.status(404).json({ error: 'Baby care item not found' });
  database.babyCare[index] = { ...database.babyCare[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(database.babyCare[index]);
});

app.delete('/api/babycare/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  database.babyCare = database.babyCare.filter(b => b.id !== id && b.ageId !== id);
  res.json({ success: true, message: 'Baby care item deleted' });
});

// --- Medicine Directory APIs ---
app.get('/api/medicines', (req, res) => {
  database.analytics.totalMedicineSearches += 1;
  const query = (req.query.q || '').toLowerCase().trim();
  const category = (req.query.category || '').toLowerCase().trim();

  let results = database.medicines;

  if (category && category !== 'all') {
    results = results.filter(m => m.category.toLowerCase().includes(category));
  }

  if (query) {
    results = results.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.genericName.toLowerCase().includes(query) ||
      m.brandNames.some(b => b.toLowerCase().includes(query)) ||
      m.purpose.toLowerCase().includes(query) ||
      m.therapeuticClass.toLowerCase().includes(query)
    );
  }

  res.json(results);
});

app.get('/api/medicines/:id', (req, res) => {
  const item = database.medicines.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Medicine not found' });
  res.json(item);
});

app.post('/api/medicines', requireAdminAuth, (req, res) => {
  const newMed = {
    id: `med-${Date.now()}`,
    brandNames: req.body.brandNames || [],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  database.medicines.unshift(newMed);
  res.status(201).json(newMed);
});

app.put('/api/medicines/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = database.medicines.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: 'Medicine not found' });
  database.medicines[index] = { ...database.medicines[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(database.medicines[index]);
});

app.delete('/api/medicines/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  database.medicines = database.medicines.filter(m => m.id !== id);
  res.json({ success: true, message: 'Medicine deleted' });
});

// --- Health Rating Rules APIs ---
app.get('/api/ratings', (req, res) => {
  res.json(database.healthRatings);
});

app.put('/api/ratings/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = database.healthRatings.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Rating bracket not found' });
  database.healthRatings[index] = { ...database.healthRatings[index], ...req.body };
  res.json(database.healthRatings[index]);
});

// --- Contact APIs ---
app.get('/api/contacts', requireAdminAuth, (req, res) => {
  res.json(database.contacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  const newContact = {
    id: `contact-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Healthcare Inquiry',
    message,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };
  database.contacts.unshift(newContact);
  res.status(201).json({ success: true, contact: newContact });
});

app.patch('/api/contacts/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = database.contacts.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Contact message not found' });
  database.contacts[index] = { ...database.contacts[index], ...req.body };
  res.json(database.contacts[index]);
});

app.delete('/api/contacts/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  database.contacts = database.contacts.filter(c => c.id !== id);
  res.json({ success: true, message: 'Message deleted' });
});

// --- Site Settings APIs ---
app.get('/api/settings', (req, res) => {
  res.json(database.siteSettings);
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  database.siteSettings = { ...database.siteSettings, ...req.body };
  res.json(database.siteSettings);
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`SYNORA Health Backend Server running on http://localhost:${PORT}`);
});
