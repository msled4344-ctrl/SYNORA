import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const aiRouter = express.Router();

// Knowledge base and symptom reasoning engine for offline/fallback mode
const medicalEmergencyPatterns = [
  /\b(chest pain|heart attack|crushing chest|left arm pain|difficulty breathing|can't breathe|choking|stroke|face droop|slurred speech|sudden blindness|severe bleeding|coughing blood|vomiting blood|unconscious|fainted|seizure|poisoning|overdose|suicide|suicidal)\b/i,
  /\b(buke betha|buke chap|shash koshto|rokto bomi|rokto pora|oshojjho betha|hothat behosh|bish khao)\b/i,
];

// Helper to sanitize and check emergencies
function checkEmergency(query) {
  for (const pattern of medicalEmergencyPatterns) {
    if (pattern.test(query)) {
      return true;
    }
  }
  return false;
}

// Fallback clinical reasoning engine when no external API key is provided
function generateClinicalResponse(query, userContext = {}) {
  const q = query.toLowerCase();
  const isBanglaOrBanglish = /[\u0980-\u09FF]|(sordi|kashi|jor|betha|matha|pet|bomi|khabar|ami|amar|ki|korbo|khabo|lagche|hochhe|oshudh)/i.test(query);

  // Extract context if present safely
  const contextNotes = [];
  if (userContext.age) contextNotes.push(`Age: ${userContext.age} yrs`);

  const conditionsStr = Array.isArray(userContext.conditions)
    ? userContext.conditions.join(', ')
    : (typeof userContext.conditions === 'string' && userContext.conditions.trim() ? userContext.conditions.trim() : '');
  if (conditionsStr) contextNotes.push(`Known conditions: ${conditionsStr}`);

  const allergiesStr = Array.isArray(userContext.allergies)
    ? userContext.allergies.join(', ')
    : (typeof userContext.allergies === 'string' && userContext.allergies.trim() ? userContext.allergies.trim() : '');
  if (allergiesStr) contextNotes.push(`Allergies: ${allergiesStr}`);

  if (userContext.bp) contextNotes.push(`BP: ${userContext.bp}`);

  // 1. Cold, Flu & Sordi / Kashi
  if (/sordi|cold|flu|runny nose|sneezing|congestion|kashi|cough|sore throat|gola betha/i.test(q)) {
    if (isBanglaOrBanglish) {
      return {
        reply: `**সর্দি ও সাধারণ ঠান্ডার জন্য যত্ন এবং পরামর্শ (Cold & Flu Care):**

আপনার ঠান্ডাজনিত সমস্যা (সর্দি/কাশি) সাধারণত ভাইরাল ইনফেকশনের কারণে হয়ে থাকে। এটি সাধারণত ৫-৭ দিনের মধ্যে শরীরের নিজস্ব রোগপ্রতিরোধ ক্ষমতায় সেরে যায়।

### সাধারণ ঘরোয়া যত্ন (Self-Care):
1. **প্রচুর তরল খাবার:** হালকা গরম পানি, তুলসী বা আদা-লেবু চা, স্যুপ এবং কুসুম গরম পানি পান করুন।
2. **ভাপ (Steam Inhalation):** দিনে ২-৩ বার গরম পানির ভাপ নিলে নাক ও সাইনাসের বন্ধ ভাব দ্রুত কমে।
3. **গরম পানির গার্গল:** গলায় খুসখুস বা ব্যথার জন্য সামান্য লবণ মিশ্রিত কুসুম গরম পানিতে দিনে ৩ বার গার্গল করুন।
4. **পর্যাপ্ত বিশ্রাম:** শরীরকে রিকভার করার সুযোগ দিন।

### ওষুধ সম্পর্কিত তথ্য (Medication Information):
* জ্বর বা গায়ে মৃদু ব্যথা থাকলে সাধারণ প্যারাসিটামল (যেমন: Napa/Ace 500mg) ডাক্তারের পরামর্শ অনুযায়ী সেবন করা যেতে পারে (দিনে সর্বোচ্চ ৩-৪ বার, ভরা পেটে)।
* অতিরিক্ত সর্দি ও হাঁচির জন্য অ্যান্টিহিস্টামিন (যেমন: Cetirizine 10mg রাতে) নেওয়া যেতে পারে।
* **সতর্কতা:** অ্যান্টিবায়োটিক নিজে নিজে কখনো খাবেন না। ভাইরাল সর্দিতে অ্যান্টিবায়োটিক কোনো কাজে আসে না।

### কখন ডাক্তার দেখাবেন (Red Flags):
* জ্বর যদি ১০২°F (৩৮.৯°C)-এর বেশি হয় বা ৩ দিনের বেশি স্থায়ী হয়।
* শ্বাস নিতে কষ্ট হলে বা বুকে চাপ লাগলে।
* কাশির সাথে রক্ত এলে বা প্রচণ্ড দুর্বলতা দেখা দিলে।`,
        followUps: [
          'আপনার কি সর্দির সাথে জ্বর বা গলা ব্যথা আছে?',
          'এই সমস্যাটি কয়দিন ধরে হচ্ছে?',
        ],
        safetyLevel: 'standard',
        disclaimer: 'SYNORA AI একটি স্বাস্থ্য তথ্য সহায়িকা। এটি কোনো চূড়ান্ত ডাক্তারি প্রেসক্রিপশন নয়। প্রয়োজনে রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।',
      };
    } else {
      return {
        reply: `**Guidance for Common Cold, Cough & Congestion:**

Common colds and runny noses are usually caused by viral infections that typically resolve within 5 to 7 days with supportive self-care.

### Recommended Supportive Self-Care:
1. **Hydration:** Drink plenty of warm fluids like warm lemon water, ginger tea, clear broths, and clean water to thin mucus secretions.
2. **Steam Inhalation:** Inhaling warm steam 2–3 times a day helps relieve nasal and sinus congestion naturally.
3. **Warm Salt Water Gargle:** Gargling with warm salt water (1/2 tsp salt in 1 cup warm water) 3 times daily soothes throat irritation.
4. **Adequate Rest:** Allow your immune system time to recover.

### General Medication Guidance:
* **For mild body aches or fever:** Paracetamol (500mg) after meals as needed, not exceeding 4g in 24 hours.
* **For sneezing/runny nose:** An over-the-counter second-generation antihistamine (such as Cetirizine 10mg at night) may provide symptomatic relief.
* **Antibiotic Warning:** Antibiotics do not cure viral colds. Do not take antibiotics without a doctor's explicit prescription.

### When to Seek Medical Attention:
* Fever above 102°F (38.9°C) or lasting longer than 3 days.
* Difficulty breathing, wheezing, or chest tightness.
* Persistent severe sore throat with difficulty swallowing.`,
        followUps: [
          'How many days have you been experiencing these symptoms?',
          'Do you have any accompanying symptoms like high fever or difficulty breathing?',
        ],
        safetyLevel: 'standard',
        disclaimer: 'SYNORA AI is an informational wellness companion and does not replace a licensed medical diagnosis.',
      };
    }
  }

  // 2. Headache / Matha Betha
  if (/headache|head ache|migraine|matha betha|matha betha/i.test(q)) {
    return {
      reply: `**Guidance for Headache & Tension Relief:**

Headaches can stem from stress, dehydration, lack of sleep, eye strain, sinus pressure, or migraines.

### Immediate Self-Care Actions:
1. **Hydrate:** Drink 1–2 large glasses of water immediately; dehydration is a frequent trigger.
2. **Rest in a Quiet Space:** Rest in a dark, quiet room with your eyes closed for 20-30 minutes.
3. **Cold or Warm Compress:** Apply a cool damp cloth over your forehead or a warm compress on the back of your neck.
4. **Screen Break:** Rest your eyes from computer and mobile screens.

### Safe Medication Consideration:
* Over-the-counter Paracetamol (500mg) with food may help relieve tension headaches. Avoid frequent daily overuse of pain medications to prevent medication-overuse headaches.

### When to Seek Urgent Medical Care:
* Sudden, explosive "thunderclap" headache (the worst headache of your life).
* Headache accompanied by stiff neck, high fever, confusion, weakness, or vision changes.
* Headache following a head injury.`,
      followUps: [
        'Is the pain on one side of your head or all over?',
        'Are you experiencing any nausea or sensitivity to light?',
      ],
      safetyLevel: 'standard',
      disclaimer: 'Informational support only. For persistent or severe headaches, consult a qualified physician.',
    };
  }

  // 3. Acidity / Heartburn / Gastric / Pet Betha
  if (/acidity|gastric|gas|heartburn|acid reflux|pet betha|stomach pain|pet kharap|indigestion/i.test(q)) {
    return {
      reply: `**Guidance for Acidity, Heartburn & Stomach Discomfort:**

Stomach irritation or acid reflux is commonly triggered by spicy or oily meals, prolonged empty stomach, stress, or irregular eating schedules.

### Supportive Relief Steps:
1. **Drink Water in Small Sips:** Avoid chugging large amounts of fluid all at once.
2. **Avoid Trigger Foods:** Stay away from fried, highly spiced foods, carbonated sodas, and excess caffeine/tea for the next 24-48 hours.
3. **Elevate Your Head:** When lying down, elevate your upper torso with an extra pillow to prevent stomach acid from rising.
4. **Eat Smaller, Frequent Meals:** Do not lie down immediately after eating; wait at least 2 hours.

### Medication Information:
* For temporary acute acidity, an antacid oral suspension (e.g. Aluminium/Magnesium hydroxide) can neutralize acid rapidly.
* For ongoing gastric ulceration or reflux, Proton Pump Inhibitors (such as Omeprazole 20mg) are taken in the morning 30 minutes before breakfast under medical direction.

### When to Consult a Doctor:
* Severe or sharp stomach pain that worsens rapidly.
* Vomiting blood or black coffee-ground material.
* Black or tarry stools, or persistent vomiting.`,
      followUps: [
        'Did this start after eating a specific meal or on an empty stomach?',
        'Are you experiencing any nausea, vomiting, or burning sensation in your chest?',
      ],
      safetyLevel: 'standard',
      disclaimer: 'SYNORA AI is not a doctor. Seek medical advice for chronic gastrointestinal symptoms.',
    };
  }

  // 4. Baby & Infant Care / Baby feeding / Baby fever
  if (/baby|baccha|child|infant|shishu|newborn|toddler|dudh|khabar/i.test(q)) {
    return {
      reply: `**Parenting & Pediatric Care Guidance:**

Caring for young infants requires gentle monitoring and age-specific safety.

### Essential Pediatric Principles:
1. **Infants Under 6 Months:** Exclusive breast milk or recommended infant formula. Do not give plain water, honey, or solid foods before 6 months.
2. **Hydration & Wet Diapers:** A healthy, well-hydrated infant should produce 6 or more wet diapers every 24 hours.
3. **Fever Care in Babies:** Dress the baby in light cotton clothes and ensure regular feeding.
4. **Safe Sleep:** Always place your baby on their back to sleep on a firm flat mattress without pillows, bumpers, or heavy blankets.

### Urgent Red Flags in Babies (Seek Immediate Pediatrician Visit):
* Any fever in a newborn under 3 months (Temperature > 100.4°F / 38°C).
* Extreme lethargy, difficulty waking up, or weak continuous crying.
* Fast breathing, chest retractions (ribs sucking in deeply), or grunting sounds.
* Refusing to feed or continuous vomiting.`,
      followUps: [
        'How old is your baby (in months or years)?',
        'Is the baby feeding normally and producing wet diapers?',
      ],
      safetyLevel: 'pediatric-alert',
      disclaimer: 'Baby care requires specialized pediatric oversight. Never administer adult medications to infants.',
    };
  }

  // 5. Sleep & Insomnia / Ghum
  if (/sleep|insomnia|can't sleep|ghum|ghum hoy na|tired|fatigue/i.test(q)) {
    return {
      reply: `**Healthy Sleep Hygiene & Recovery Recommendations:**

Quality sleep is vital for hormone regulation, brain detox, and immune vitality.

### Science-Backed Sleep Optimization:
1. **Circadian Regularity:** Go to bed and wake up at the same time every day, including weekends.
2. **Screen Curfew:** Turn off all smartphones, tablets, and TV screens at least 45 minutes before sleep (blue light suppresses melatonin).
3. **Caffeine Cut-off:** Avoid tea, coffee, energy drinks, and heavy chocolate after 2:00 PM.
4. **Environment:** Keep your bedroom cool (around 20–22°C / 68–72°F), completely dark, and quiet.
5. **Pre-Sleep Wind Down:** Try deep diaphragmatic breathing (4-7-8 method), reading a book, or taking a warm bath.

### When to Seek Medical Support:
* If chronic insomnia persists for more than 4 weeks and impairs your daytime cognitive function or driving.`,
      followUps: [
        'What time do you usually go to bed, and how many hours of sleep do you get?',
        'Do you consume tea, coffee, or use screens right before bedtime?',
      ],
      safetyLevel: 'wellness',
      disclaimer: 'Informational wellness tips. Consult a physician if experiencing chronic sleep apnea or severe insomnia.',
    };
  }

  // 6. Blood Pressure / Diabetes / General Chronic Health
  if (/blood pressure|hypertension|high bp|diabetes|sugar|cholesterol|heart/i.test(q)) {
    return {
      reply: `**Cardiovascular & Metabolic Health Insights:**

Managing chronic indicators like blood pressure and blood sugar requires consistent lifestyle habits alongside prescribed medical regimens.

### Core Lifestyle Pillars:
1. **Dietary Management:** Reduce dietary sodium (under 2,000mg/day) for blood pressure control. For blood glucose stability, choose low-glycemic complex carbohydrates (whole oats, brown rice, pulses) and plenty of fiber.
2. **Daily Physical Activity:** 30 minutes of moderate aerobic exercise (brisk walking, cycling) 5 days a week improves insulin sensitivity and vascular elasticity.
3. **Stress Control:** Chronic stress releases cortisol and adrenaline, which spike both blood pressure and glucose levels.
4. **Regular Monitoring:** Keep a logbook of your BP (morning and evening) and fasting blood glucose.

### Important Safety Rule:
* Never stop or adjust your prescribed antihypertensive or antidiabetic medications without your doctor's explicit approval.`,
      followUps: [
        'What was your most recent blood pressure or blood sugar reading?',
        'Are you currently taking any prescribed daily medications?',
      ],
      safetyLevel: 'chronic-care',
      disclaimer: 'SYNORA provides general health education and does not replace regular clinical doctor reviews.',
    };
  }

  // General default helpful healthcare guidance
  return {
    reply: `**SYNORA Healthcare Assessment & Guidance:**

Thank you for reaching out to SYNORA. Based on your inquiry: *"__QUERY__"*, here is clear and safe health information:

${contextNotes.length > 0 ? `*Context considered: ${contextNotes.join(' | ')}*\n` : ''}
### General Wellness & Care Steps:
1. **Stay Well Hydrated:** Drink plenty of clean water and natural fluids throughout the day.
2. **Rest & Recovery:** Give your body adequate rest and avoid heavy physical overexertion while symptoms persist.
3. **Monitor Symptoms:** Pay close attention to whether symptoms are improving or worsening over the next 24 to 48 hours.
4. **Nutrition:** Eat balanced, freshly cooked, easily digestible meals rich in vegetables, fruits, and lean protein.

### Safe Medication Rule:
* Do not self-prescribe unfamiliar or prescription-only medicines (especially antibiotics, steroids, or strong sedatives).
* For mild fever or pain, simple over-the-counter paracetamol can be used safely when taken according to package directions.

### When to Seek Medical Evaluation:
* If symptoms persist for more than 3 to 5 days without improvement.
* If you develop high fever, severe pain, breathing difficulty, or noticeable weakness.`.replace('__QUERY__', query),
    followUps: [
      'Could you share more details about how long you have felt this way?',
      'Do you have any other symptoms or existing health conditions?',
    ],
    safetyLevel: 'standard',
    disclaimer: 'SYNORA AI is an informational assistant, not a doctor. In case of acute or serious symptoms, consult a qualified healthcare professional.',
  };
}

// POST /api/ai/chat
aiRouter.post('/chat', async (req, res) => {
  try {
    // Dynamically reload .env to ensure fresh API keys without requiring server restart
    dotenv.config({ override: true });

    const { message, context = {}, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmedMessage = message.trim();

    // 1. Emergency Detection Guardrail
    if (checkEmergency(trimmedMessage)) {
      return res.json({
        isEmergency: true,
        reply: `⚠️ **URGENT MEDICAL EMERGENCY DETECTED** ⚠️

The symptoms you mentioned (such as severe chest pain, breathing difficulty, signs of stroke, or critical trauma) require **IMMEDIATE EMERGENCY MEDICAL CARE**.

### Immediate Actions:
1. **Call Emergency Services Right Now:**
   * **National Emergency (Bangladesh):** 999
   * **Emergency (US/Canada):** 911
   * **Emergency (UK/EU):** 999 / 112
   * **National Health Call Center:** 16263
2. **Do NOT drive yourself.** Have someone drive you or wait for an ambulance.
3. **Sit or lie down in a safe, comfortable position.**
4. If with someone experiencing chest pain, keep them calm while emergency assistance arrives.

*SYNORA AI cannot diagnose or treat life-threatening medical emergencies.*`,
        followUps: [],
        safetyLevel: 'emergency',
        disclaimer: 'EMERGENCY: Seek immediate hospital care or call 999/911.',
      });
    }

    // 2. Check if OpenRouter API key is available
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const openRouterModel = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free';

    if (openRouterApiKey) {
      try {
        const isBanglaQuery = /[\u0980-\u09FF]|(sordi|kashi|jor|betha|matha|pet|bomi|khabar|ami|amar|ki|korbo|khabo|lagche|hochhe|oshudh)/i.test(trimmedMessage);

        const systemPrompt = `You are SYNORA, an empathetic, concise, and clinically safe digital AI health companion.
Communication Guidelines:
1. Concise & Structured: Keep responses compact, clear, and easy to read on mobile or desktop. Avoid unnecessary filler or lengthy introductions.
2. Language:
   - If user asks in Bengali (বাংলা) or Banglish, reply in warm, natural, fluent Bengali (বাংলা).
   - If user asks in English, reply in crisp, clear, and supportive English.
3. Response Format:
   - Short 1-sentence assessment.
   - 📌 **ঘরোয়া যত্ন / Key Actions** (3-4 concise bullet points).
   - 💊 **নিরাপদ তথ্য / Relief Notes** (safe OTC tips & doctor consultation advice).
   - ⚠️ **কখন ডাক্তার দেখাবেন / Red Flags** (2-3 crucial warning signs).
4. Safety: Never pretend to be a physical physician, never prescribe prescription-only medications or dangerous dosages.
5. User Context: ${JSON.stringify(context)}`;

        // Build messages payload including multi-turn history (excluding client errors)
        const apiMessages = [
          { role: 'system', content: systemPrompt },
        ];

        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-8)) {
            if (item && item.content && typeof item.content === 'string') {
              const contentTrimmed = item.content.trim();
              // Skip error messages from history
              if (
                contentTrimmed &&
                !contentTrimmed.includes('communication error') &&
                !contentTrimmed.includes('Unable to reach') &&
                !contentTrimmed.includes('সংযোগের সমস্যা')
              ) {
                apiMessages.push({
                  role: item.role === 'ai' || item.role === 'assistant' ? 'assistant' : 'user',
                  content: contentTrimmed.slice(0, 1500),
                });
              }
            }
          }
        }

        apiMessages.push({
          role: 'user',
          content: trimmedMessage,
        });

        // Tested and verified active OpenRouter models
        const candidateModels = [
          openRouterModel,
          'google/gemini-2.5-flash',
          'google/gemini-2.5-flash-lite',
          'google/gemini-3.5-flash-lite',
          'deepseek/deepseek-chat',
        ].filter((m, i, arr) => arr.indexOf(m) === i && typeof m === 'string' && m.trim());

        let generatedText = null;
        let usedModel = openRouterModel;

        for (const modelToTry of candidateModels) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);

            const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openRouterApiKey}`,
                'HTTP-Referer': 'https://synora.health',
                'X-Title': 'SYNORA AI Health Companion',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: modelToTry,
                messages: apiMessages,
                temperature: 0.3,
                max_tokens: 1500,
              }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (openRouterResponse.ok) {
              const data = await openRouterResponse.json();
              let text = data.choices?.[0]?.message?.content;

              if (Array.isArray(text)) {
                text = text
                  .map((chunk) => (typeof chunk === 'string' ? chunk : chunk.text || ''))
                  .join('');
              }

              if (!text && data.choices?.[0]?.text) {
                text = data.choices[0].text;
              }

              if (text && typeof text === 'string' && text.trim()) {
                generatedText = text.trim();
                usedModel = modelToTry;
                break;
              }
            } else {
              const errData = await openRouterResponse.json().catch(() => ({}));
              console.warn(`OpenRouter model ${modelToTry} returned status ${openRouterResponse.status}:`, errData);
            }
          } catch (fetchErr) {
            console.warn(`OpenRouter attempt with ${modelToTry} failed:`, fetchErr.message);
          }
        }

        if (generatedText) {
          const isBangla = isBanglaQuery;
          const followUps = isBangla
            ? [
              'এই লক্ষণগুলো কয়দিন ধরে হচ্ছে?',
              'আপনার কি অন্য কোনো ক্রনিক রোগ বা অ্যালার্জি আছে?',
              'কোন ঘরোয়া উপায়গুলো এখন সবচেয়ে নিরাপদ?',
            ]
            : [
              'How long have you been experiencing these symptoms?',
              'Are you taking any daily medications or have known allergies?',
              'What safe self-care steps are recommended right now?',
            ];

          return res.json({
            reply: generatedText,
            followUps,
            safetyLevel: 'standard',
            provider: 'openrouter',
            model: usedModel,
            disclaimer: isBangla
              ? 'সিনোরা এআই একটি স্বাস্থ্য তথ্য ও শিক্ষা সহায়িকা। এটি চিকিৎসকের সরাসরি প্রেসক্রিপশনের বিকল্প নয়।'
              : 'SYNORA AI is an informational wellness companion, not a substitute for professional medical advice.',
          });
        }
      } catch (openRouterErr) {
        console.warn('OpenRouter API call processing failed, falling back:', openRouterErr.message);
      }
    }

    // 3. Fallback: Check if external direct Gemini API key is available
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const systemPrompt = `You are SYNORA, an empathetic, safe, clear, and professional digital AI healthcare assistant designed for ordinary people.
Instructions:
- Keep language simple, trustworthy, warm, accessible, and free of overly dense medical jargon.
- If the user writes in Bangla or Banglish, respond helpfully in Bangla or Banglish with English subtitles/clarity.
- NEVER pretend to be a doctor, never guarantee a diagnosis, never prescribe unsafe prescription medicines or dosages.
- Always provide safe home care, explain possible causes cautiously, mention when to see a doctor, and state when symptoms are emergency red flags.
- User Context (if available): ${JSON.stringify(context)}
- Format with clean Markdown (bold headers, bullet points, numbered lists).`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${trimmedMessage}` }] }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return res.json({
              reply: generatedText,
              followUps: [
                'How long have you had these symptoms?',
                'Are you taking any medications or have allergies?',
              ],
              safetyLevel: 'standard',
              provider: 'gemini',
              disclaimer: 'SYNORA AI is an informational wellness companion, not a substitute for professional medical advice.',
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using clinical fallback engine:', geminiErr.message);
      }
    }

    // 4. Built-in Clinical Reasoning Engine (Offline/Fallback)
    const responseData = generateClinicalResponse(trimmedMessage, context);
    return res.json(responseData);

  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your healthcare inquiry. Please try again.',
    });
  }
});

// Helper function to extract and parse JSON from AI response text
function extractCleanJson(text) {
  if (!text || typeof text !== 'string') return null;
  try {
    // 1. Direct JSON parse
    return JSON.parse(text.trim());
  } catch (e) {
    // 2. Strip markdown code fences ```json ... ```
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (err2) {
        // continue
      }
    }
    // 3. Find outermost curly braces
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1).trim());
      } catch (err3) {
        // continue
      }
    }
    return null;
  }
}

// ============================================================================
// 2. Prescription Scanner & AI Data Extraction via Gemini Multimodal OCR
// ============================================================================
aiRouter.post('/scan-prescription', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg' } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'A valid prescription image is required for scanning.',
      });
    }

    // Prepare full data URL and base64 parts
    let dataUrl = image;
    let base64Data = image;
    let cleanMime = mimeType;

    if (image.startsWith('data:')) {
      dataUrl = image;
      const parts = image.split(',');
      base64Data = parts[1] || '';
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) cleanMime = mimeMatch[1];
    } else {
      dataUrl = `data:${mimeType};base64,${image}`;
    }

    // Strict clinical extraction prompt
    const promptText = `You are SYNORA AI's Clinical OCR & Prescription Analysis Engine.
Analyze this medical prescription image carefully and extract all visible, legible information into a structured JSON format.

CRITICAL HEALTHCARE SAFETY & ACCURACY RULES:
1. NEVER guess or hallucinate medicine names, dosages, strengths, or doctor instructions.
2. If any handwriting, text, dosage, or name is blurry, faded, cut off, or illegible, DO NOT invent data. Explicitly write "Information could not be clearly detected" or "Please verify with original prescription" and add an entry in "unclearItems".
3. Distinguish clearly between Brand names (e.g., Napa, Seclo, Alatrol, Zithrin, Monas, Augmentin) and Generic names (e.g., Paracetamol, Omeprazole, Cetirizine, Azithromycin, Montelukast, Amoxicillin).
4. Parse medicine frequencies accurately (e.g., "1+0+1", "1-0-1", "1+1+1", "0+0+1", "Once daily", "Twice daily", "TDS", "OD", "BD", "HS").
5. Note meal instructions if present (e.g., "After food", "Before food", "With food", "Empty stomach").
6. You MUST respond ONLY with a single valid JSON object. Do not include introductory or explanatory conversational text outside the JSON.

JSON SCHEMA TO RETURN:
{
  "patientInfo": {
    "name": "Patient's Full Name (or 'Information could not be clearly detected')",
    "age": "Age in years/months if written (or '')",
    "gender": "Male / Female / Other if written (or '')",
    "prescriptionDate": "Date on the prescription (or '')"
  },
  "doctorInfo": {
    "name": "Doctor's Name with title e.g. Dr. ... (or 'Information could not be clearly detected')",
    "qualification": "Degrees e.g. MBBS, FCPS, MD (or '')",
    "specialization": "Specialization e.g. Medicine, Cardiology, Pediatrics (or '')",
    "hospital": "Hospital, Clinic, or Chamber name (or '')",
    "contact": "Phone/Email/Reg No if visible (or '')"
  },
  "medicines": [
    {
      "name": "Medicine Name (Brand or Generic as written)",
      "genericName": "Generic Formulation if identifiable (or '')",
      "strength": "e.g., 500mg, 20mg, 5ml, 100ml, 10mg (or 'As advised')",
      "form": "Tablet / Capsule / Syrup / Suspension / Drop / Inhaler / Injection / Ointment / Suppository / Other",
      "quantity": "Quantity e.g., 10 Tablets, 1 Bottle, 1 Box (or '')",
      "frequency": "e.g., 1+0+1, 1-0-1, 1+1+1, 0+0+1, Once daily, Twice daily (or 'As directed')",
      "timing": "Morning / Afternoon / Night / As needed (or '')",
      "duration": "e.g., 5 days, 7 days, 14 days, 1 month, Continue (or '')",
      "instructions": "Specific intake instructions (e.g., take with warm water, finish full course)",
      "mealInstruction": "After Food / Before Food / With Food / Not specified"
    }
  ],
  "diagnosis": "Clinical diagnosis, chief complaints, or symptoms written on prescription (or 'Not specified')",
  "tests": ["List of advised diagnostic laboratory tests, X-rays, blood tests (or empty array)"],
  "doctorNotes": "General advice, dietary restrictions, lifestyle guidance written by the doctor (or '')",
  "followUpDate": "Advised return/follow-up date or timeframe if written (or '')",
  "unclearItems": ["List of any fields or lines where handwriting was ambiguous or partially unreadable"],
  "confidenceNotice": "AI/OCR-generated interpretation. This is not a replacement for a doctor's advice. Always verify with original prescription."
}`;

    let parsedResult = null;
    let providerUsed = 'fallback';

    // 1. Try via OpenRouter with Gemini Multimodal Models
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (openRouterApiKey) {
      const candidateVisionModels = [
        process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
        'google/gemini-2.5-flash',
        'google/gemini-2.5-flash-lite',
        'google/gemini-3.5-flash-lite',
        'anthropic/claude-3.5-haiku',
      ].filter((m, i, arr) => arr.indexOf(m) === i && typeof m === 'string' && m.trim());

      for (const modelToTry of candidateVisionModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 35000);

          const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterApiKey}`,
              'HTTP-Referer': 'https://synora.health',
              'X-Title': 'SYNORA AI Prescription Scanner',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelToTry,
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: promptText },
                    { type: 'image_url', image_url: { url: dataUrl } }
                  ],
                },
              ],
              temperature: 0.1,
              max_tokens: 2500,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (openRouterResponse.ok) {
            const data = await openRouterResponse.json();
            let text = data.choices?.[0]?.message?.content;
            if (Array.isArray(text)) {
              text = text.map(c => (typeof c === 'string' ? c : c.text || '')).join('');
            }
            if (!text && data.choices?.[0]?.text) {
              text = data.choices[0].text;
            }

            if (text && typeof text === 'string') {
              parsedResult = extractCleanJson(text);
              if (parsedResult) {
                providerUsed = `OpenRouter (${modelToTry})`;
                break;
              }
            }
          } else {
            console.warn(`OpenRouter Vision attempt with ${modelToTry} returned status ${openRouterResponse.status}`);
          }
        } catch (fetchErr) {
          console.warn(`OpenRouter Vision attempt with ${modelToTry} failed:`, fetchErr.message);
        }
      }
    }

    // 2. Try Direct Google Gemini API if direct GEMINI_API_KEY is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!parsedResult && geminiApiKey) {
      try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptText },
                  {
                    inline_data: {
                      mime_type: cleanMime,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2500,
            },
          }),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            parsedResult = extractCleanJson(text);
            if (parsedResult) {
              providerUsed = 'Google Gemini Direct API';
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Direct Gemini API Prescription OCR failed:', geminiErr.message);
      }
    }

    // 3. If AI parsing succeeded, validate and sanitize payload
    if (parsedResult) {
      // Normalize patient info
      const patientInfo = {
        name: parsedResult.patientInfo?.name || 'Information could not be clearly detected',
        age: parsedResult.patientInfo?.age || '',
        gender: parsedResult.patientInfo?.gender || '',
        prescriptionDate: parsedResult.patientInfo?.prescriptionDate || '',
      };

      // Normalize doctor info
      const doctorInfo = {
        name: parsedResult.doctorInfo?.name || 'Information could not be clearly detected',
        qualification: parsedResult.doctorInfo?.qualification || '',
        specialization: parsedResult.doctorInfo?.specialization || '',
        hospital: parsedResult.doctorInfo?.hospital || '',
        contact: parsedResult.doctorInfo?.contact || '',
      };

      // Normalize medicines array
      const rawMedicines = Array.isArray(parsedResult.medicines) ? parsedResult.medicines : [];
      const medicines = rawMedicines.map((m, idx) => ({
        id: `med-${idx + 1}-${Date.now()}`,
        name: m.name || 'Information could not be clearly detected',
        genericName: m.genericName || '',
        strength: m.strength || 'As advised',
        form: m.form || 'Tablet',
        quantity: m.quantity || '',
        frequency: m.frequency || 'As directed',
        timing: m.timing || '',
        duration: m.duration || '',
        instructions: m.instructions || '',
        mealInstruction: m.mealInstruction || 'Not specified',
      }));

      const now = new Date();
      const scanDate = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const scanTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      return res.json({
        success: true,
        provider: providerUsed,
        data: {
          patientInfo,
          doctorInfo,
          medicines,
          diagnosis: parsedResult.diagnosis || 'Not specified',
          tests: Array.isArray(parsedResult.tests) ? parsedResult.tests : [],
          doctorNotes: parsedResult.doctorNotes || '',
          followUpDate: parsedResult.followUpDate || '',
          unclearItems: Array.isArray(parsedResult.unclearItems) ? parsedResult.unclearItems : [],
          confidenceNotice: parsedResult.confidenceNotice || 'AI/OCR-generated interpretation. Please verify this information with the original prescription and a registered doctor.',
          scanDate,
          scanTime,
          scannedAt: now.toISOString(),
        },
      });
    }

    // 4. Fallback if AI couldn't parse image structure
    const now = new Date();
    return res.json({
      success: true,
      provider: 'Clinical Safe Fallback',
      data: {
        patientInfo: {
          name: 'Information could not be clearly detected',
          age: '',
          gender: '',
          prescriptionDate: '',
        },
        doctorInfo: {
          name: 'Information could not be clearly detected',
          qualification: '',
          specialization: '',
          hospital: '',
          contact: '',
        },
        medicines: [
          {
            id: `med-fallback-${Date.now()}`,
            name: 'Information could not be clearly detected',
            genericName: '',
            strength: 'Please verify with original prescription',
            form: 'Tablet',
            quantity: '',
            frequency: 'As prescribed by doctor',
            timing: '',
            duration: '',
            instructions: 'Please inspect original prescription',
            mealInstruction: 'Not specified',
          }
        ],
        diagnosis: 'Prescription text was unclear or handwritten in a format requiring manual review.',
        tests: [],
        doctorNotes: 'Handwriting was ambiguous. Please verify all details directly from the physical prescription.',
        followUpDate: '',
        unclearItems: ['Prescription details require manual verification due to image clarity or handwriting format.'],
        confidenceNotice: 'AI/OCR-generated interpretation. This is not a replacement for a doctor\'s advice. Always verify with original prescription.',
        scanDate: now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        scanTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        scannedAt: now.toISOString(),
      },
    });

  } catch (err) {
    console.error('Error in /api/ai/scan-prescription:', err);
    return res.status(500).json({
      error: 'Processing Error',
      message: 'Failed to process the prescription image. Please ensure the image is clear and try again.',
    });
  }
});

