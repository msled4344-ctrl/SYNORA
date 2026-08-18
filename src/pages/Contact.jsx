import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { siteSettings, submitContactMessage } = useHealthData();
  const { language, t } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqs = [
    {
      q: language === 'bn' ? 'সিনোরা কি কোনো সার্টিফাইড ডাক্তার?' : 'Is SYNORA a certified medical doctor?',
      a: language === 'bn'
        ? 'না। সিনোরা একটি ডিজিটাল এআই স্বাস্থ্য সহায়িকা ও তথ্য প্ল্যাটফর্ম। এটি সাধারণ স্বাস্থ্য সচেতনতা ও পরামর্শ দেয় কিন্তু কোনো চূড়ান্ত প্রেসক্রিপশন বা রোগ নির্ণয় করে না। গুরুতর অসুস্থতায় ডাক্তারের কাছে যাওয়া আবশ্যক।'
        : 'No. SYNORA is an AI-powered informational healthcare companion. It provides evidence-backed lifestyle and supportive guidance, but never replaces a physical medical examination by a licensed physician.',
    },
    {
      q: language === 'bn' ? 'ভয়েস ইনপুট কীভাবে কাজ করে?' : 'How does the Voice Input feature work?',
      a: language === 'bn'
        ? 'এআই হেলথ পেজে থাকা মাইক্রোফোন বাটনে একবার চাপ দিন এবং আপনার প্রশ্নটি স্পষ্ট ভাষায় বলুন। আপনার কথা স্বয়ংক্রিয়ভাবে টেক্সটে রূপান্তর হবে এবং আপনি চাইলে পাঠানোর আগে তা দেখতে ও ঠিক করতে পারবেন।'
        : 'Simply tap the microphone icon next to the chat bar and speak your question naturally. SYNORA converts your speech to text and allows you to review it before submitting.',
    },
    {
      q: language === 'bn' ? 'আমার স্বাস্থ্য তথ্য ও শিশুর তথ্য কি নিরাপদ?' : 'Is my health and child profile data private and secure?',
      a: language === 'bn'
        ? 'হ্যাঁ। আপনার স্বাস্থ্য তথ্য এবং শিশুর রেকর্ড সম্পূর্ণ ব্যক্তিগত এবং সুরক্ষিত ডেটাবেসে এনক্রিপ্ট অবস্থায় সংরক্ষিত থাকে।'
        : 'Yes. SYNORA utilizes strict privacy controls and Firestore security rules to ensure that only you have access to your personal and child health profiles.',
    },
    {
      q: language === 'bn' ? 'জরুরি পরিস্থিতিতে সিনোরা কীভাবে সাহায্য করে?' : 'What should I do during an acute medical emergency?',
      a: language === 'bn'
        ? 'তীব্র বুকে ব্যথা, শ্বাসকষ্ট, অসাড়তা বা দুর্ঘটনার মতো পরিস্থিতিতে অবিলম্বে জাতীয় জরুরি সেবা ৯৯৯ বা ১৬২৬৩ নম্বরে সরাসরি কল করুন।'
        : 'For life-threatening symptoms (e.g. crushing chest pain, signs of stroke, difficulty breathing), immediately dial 999, 911, or contact your nearest emergency room.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    submitContactMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim() || 'General Inquiry',
      message: form.message.trim(),
    });

    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">
            {language === 'bn' ? 'সিনোরা স্বাস্থ্য দলের সাথে যোগাযোগ' : 'Get in Touch with SYNORA'}
          </h1>
          <p className="section-desc">
            {language === 'bn'
              ? 'আমাদের স্বাস্থ্য প্রযুক্তি দল এবং সহায়তা কেন্দ্র সার্বক্ষণিক আপনার পাশে রয়েছে।'
              : 'Have inquiries regarding healthcare tools, feedback, or partnerships? Reach out to our dedicated support team.'}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Contact Info Card */}
          <div>
            <div className="card" style={{ padding: '2rem', height: '100%' }}>
              <h3 style={{ marginBottom: '1.25rem' }}>Contact Information</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Us</strong>
                    <a href={`mailto:${siteSettings?.contact?.email}`} style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {siteSettings?.contact?.email || 'care@synora.health'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--brand-blue-light)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Health Helpline</strong>
                    <span style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {siteSettings?.hotlines?.healthCallCenter || '16263'} / {siteSettings?.contact?.phone || '+880 1700-000000'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>HQ Address</strong>
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      {siteSettings?.contact?.address || 'Innovation Hub, Dhaka / Global'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: 'var(--status-danger)', fontWeight: '700' }}>
                  <Phone size={18} />
                  <span>24/7 Emergency Dispatch</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  For urgent ambulance dispatch or critical trauma, please dial <strong>999 / 911</strong> directly.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Send Us a Message</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Fill in the form below and our clinical coordination team will review your message.
              </p>

              {submitted && (
                <div
                  className="badge badge-success"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.92rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+880 1..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Baby care feedback"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    required
                    className="form-textarea"
                    rows={4}
                    placeholder="How can we assist you?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                  <Send size={18} />
                  <span>Send Message to SYNORA</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <h2 className="section-title">Common Patient Inquiries</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    borderColor: isOpen ? 'var(--brand-primary)' : 'var(--border-subtle)',
                  }}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {faq.q}
                    </h4>
                    {isOpen ? <ChevronUp size={18} color="var(--brand-primary)" /> : <ChevronDown size={18} />}
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
