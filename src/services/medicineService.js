import medicineDataset from '../data/synora_medicine_data.json';

/**
 * Bengali search synonyms dictionary mapping common Bengali terms to English medical keywords
 */
export const BENGALI_SYNONYMS = {
  'প্যারাসিটামল': ['paracetamol', 'napa', 'ace', 'fast', 'fever', 'pain'],
  'নাপা': ['paracetamol', 'napa', 'fever', 'pain'],
  'এইস': ['paracetamol', 'ace'],
  'ফাস্ট': ['paracetamol', 'fast'],
  'প্যানাডল': ['paracetamol', 'panadol'],
  'জ্বর': ['paracetamol', 'fever', 'ibuprofen', 'naproxen'],
  'ব্যথা': ['paracetamol', 'ibuprofen', 'pain', 'naproxen', 'aceclofenac', 'diclofenac'],
  'মাথা ব্যথা': ['paracetamol', 'ibuprofen', 'headache', 'pain'],
  'মাথাব্যথা': ['paracetamol', 'ibuprofen', 'headache', 'pain'],
  'দাঁতের ব্যথা': ['paracetamol', 'ketorolac', 'ibuprofen', 'toothache'],
  'সেকলো': ['omeprazole', 'seclo'],
  'লোসেকটিল': ['omeprazole', 'losectil'],
  'ওমেপ্রাজল': ['omeprazole'],
  'নেক্সাম': ['esomeprazole', 'nexum'],
  'ম্যাক্সপ্রো': ['esomeprazole', 'maxpro'],
  'সার্জেল': ['esomeprazole', 'sergel'],
  'প্যান্টোপ্রাজল': ['pantoprazole', 'pantobex'],
  'গ্যাস': ['omeprazole', 'esomeprazole', 'antacid', 'gastrointestinal', 'gastric', 'heartburn', 'gas'],
  'গ্যাস্ট্রিক': ['omeprazole', 'esomeprazole', 'gastric', 'heartburn', 'antacid'],
  'বুক জ্বালা': ['omeprazole', 'esomeprazole', 'heartburn', 'acid', 'antacid'],
  'অম্বল': ['antacid', 'omeprazole', 'heartburn', 'acidity'],
  'অ্যালাট্রোল': ['cetirizine', 'alatrol'],
  'সেট্রিজিন': ['cetirizine'],
  'কিউরিন': ['levocetirizine', 'curin'],
  'ফেক্সো': ['fexofenadine', 'fexo'],
  'অ্যালার্জি': ['cetirizine', 'levocetirizine', 'fexofenadine', 'allergy', 'antihistamine'],
  'এলার্জি': ['cetirizine', 'levocetirizine', 'fexofenadine', 'allergy'],
  'সর্দি': ['cetirizine', 'phenylephrine', 'cold', 'rhinitis', 'chlorpheniramine'],
  'হাঁচি': ['cetirizine', 'levocetirizine', 'sneezing', 'allergy'],
  'কাশি': ['dextromethorphan', 'guaifenesin', 'ambroxol', 'cough', 'respiratory'],
  'শুকনো কাশি': ['dextromethorphan', 'dry cough'],
  'কফ': ['guaifenesin', 'ambroxol', 'phlegm', 'mucus'],
  'মক্সাসিল': ['amoxicillin', 'moxacil'],
  'অ্যামোক্সিসিলিন': ['amoxicillin'],
  'অগমেন্টিন': ['amoxicillin', 'clavulanic', 'augmentin', 'moxaclav'],
  'অ্যান্টিবায়োটিক': ['antibiotics', 'amoxicillin', 'azithromycin', 'cefixime', 'ciprofloxacin'],
  'জিথ্রিন': ['azithromycin', 'zithrin'],
  'অ্যাজিথ্রোমাইসিন': ['azithromycin'],
  'সেফ-৩': ['cefixime', 'cef-3'],
  'সিপ্রোসিন': ['ciprofloxacin', 'ciprocin'],
  'ওরস্যালাইন': ['ors', 'saline', 'orsaline'],
  'স্যালাইন': ['ors', 'saline', 'electrolyte'],
  'ডায়রিয়া': ['ors', 'metronidazole', 'zinc', 'diarrhea'],
  'পাতলা পায়খানা': ['ors', 'zinc', 'metronidazole', 'diarrhea'],
  'বমি': ['domperidone', 'ondansetron', 'vomiting', 'nausea'],
  'পানিশূন্যতা': ['ors', 'dehydration', 'electrolytes'],
  'ফ্লাজিল': ['metronidazole', 'flagyl'],
  'মেট্রোনিডাজল': ['metronidazole'],
  'আমাশয়': ['metronidazole', 'dysentery', 'amoebiasis'],
  'ভেন্টোলিন': ['salbutamol', 'ventolin', 'inhaler'],
  'সালবুটামল': ['salbutamol'],
  'ইনহেলার': ['salbutamol', 'budesonide', 'inhaler', 'asthma'],
  'হাঁপানি': ['salbutamol', 'montelukast', 'asthma', 'budesonide'],
  'শ্বাসকষ্ট': ['salbutamol', 'montelukast', 'breathing', 'asthma'],
  'মোনাস': ['montelukast', 'monas'],
  'মন্টেলুকাস্ট': ['montelukast'],
  'আইবুপ্রোফেন': ['ibuprofen'],
  'প্রেসার': ['amlodipine', 'losartan', 'cardiovascular', 'hypertension', 'bp'],
  'উচ্চ রক্তচাপ': ['amlodipine', 'losartan', 'telmisartan', 'hypertension'],
  'ডায়াবেটিস': ['metformin', 'gliclazide', 'diabetes', 'sugar'],
  'সুগার': ['metformin', 'diabetes', 'insulin', 'sugar'],
  'কোলেস্টেরল': ['atorvastatin', 'rosuvastatin', 'cholesterol', 'statin'],
  'থাইরয়েড': ['levothyroxine', 'carbimazole', 'thyroid'],
  'ভিটামিন': ['vitamin', 'calcium', 'zinc', 'b-complex'],
  'ক্যালসিয়াম': ['calcium', 'calbo-d', 'bone'],
  'দাদ': ['fluconazole', 'clotrimazole', 'terbinafine', 'antifungal'],
  'চুলকানি': ['calamine', 'cetirizine', 'clotrimazole', 'itching'],
  'পোড়া': ['silver sulfadiazine', 'burnsil', 'burn'],
};

/**
 * Normalizes string for case-insensitive matching
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF\-\+\/\.]/g, ' ')
    .replace(/\s+/g, ' ');
};

/**
 * Calculates search ranking score for a medicine record
 * Higher score = higher ranking
 * Ranking Priority:
 * 1. Exact generic-name match (score: 1000+)
 * 2. Exact brand-name match (score: 800+)
 * 3. Generic-name partial / startsWith match (score: 500+)
 * 4. Brand-name partial / startsWith match (score: 350+)
 * 5. Category match (score: 200+)
 * 6. Common-use / therapeutic match (score: 100+)
 */
const calculateSearchScore = (medicine, queryTokens, originalQuery) => {
  if (!queryTokens.length) return 1;

  const rawQuery = originalQuery.toLowerCase().trim();
  const nameLower = (medicine.name || '').toLowerCase();
  const genericLower = (medicine.genericName || '').toLowerCase();
  const categoryLower = (medicine.category || '').toLowerCase();
  const usesLower = (medicine.commonUses || '').toLowerCase();
  const therapeuticLower = (medicine.therapeuticClass || '').toLowerCase();
  const brandNamesLower = (medicine.brandNames || []).map((b) => b.toLowerCase());

  let totalScore = 0;
  let matchesAny = false;

  // 1. Exact generic / main name match
  if (nameLower === rawQuery || genericLower === rawQuery) {
    totalScore += 1200;
    matchesAny = true;
  } else if (nameLower.startsWith(rawQuery) || genericLower.startsWith(rawQuery)) {
    totalScore += 700;
    matchesAny = true;
  } else if (nameLower.includes(rawQuery) || genericLower.includes(rawQuery)) {
    totalScore += 500;
    matchesAny = true;
  }

  // 2. Brand names match
  for (const brand of brandNamesLower) {
    if (brand === rawQuery) {
      totalScore += 1000;
      matchesAny = true;
      break;
    } else if (brand.startsWith(rawQuery)) {
      totalScore += 600;
      matchesAny = true;
    } else if (brand.includes(rawQuery)) {
      totalScore += 400;
      matchesAny = true;
    }
  }

  // 3. Category match
  if (categoryLower === rawQuery) {
    totalScore += 350;
    matchesAny = true;
  } else if (categoryLower.includes(rawQuery)) {
    totalScore += 250;
    matchesAny = true;
  }

  // 4. Therapeutic class match
  if (therapeuticLower.includes(rawQuery)) {
    totalScore += 180;
    matchesAny = true;
  }

  // 5. Common uses match
  if (usesLower.includes(rawQuery)) {
    totalScore += 120;
    matchesAny = true;
  }

  // Check token-based multi-word search
  for (const token of queryTokens) {
    if (!token || token === rawQuery) continue;

    if (nameLower.includes(token) || genericLower.includes(token)) {
      totalScore += 150;
      matchesAny = true;
    }

    if (brandNamesLower.some((b) => b.includes(token))) {
      totalScore += 120;
      matchesAny = true;
    }

    if (categoryLower.includes(token)) {
      totalScore += 80;
      matchesAny = true;
    }

    if (usesLower.includes(token) || therapeuticLower.includes(token)) {
      totalScore += 50;
      matchesAny = true;
    }
  }

  return matchesAny ? totalScore : 0;
};

/**
 * Returns all medicines from the dataset
 */
export const getAllMedicines = () => {
  return [...medicineDataset];
};

/**
 * Returns medicine by ID
 */
export const getMedicineById = (id) => {
  if (!id) return null;
  return medicineDataset.find((med) => med.id === id) || null;
};

/**
 * Returns all unique categories available in the dataset
 */
export const getMedicineCategories = () => {
  const categoriesSet = new Set(medicineDataset.map((med) => med.category).filter(Boolean));
  return ['All', ...Array.from(categoriesSet)];
};

/**
 * Returns all antibiotics
 */
export const getAntibiotics = () => {
  return medicineDataset.filter((med) => med.isAntibiotic || med.category === 'Antibiotics');
};

/**
 * Core dynamic search and filter service for medicines
 * @param {Object} options
 * @param {string} options.query - search term
 * @param {string} options.category - active category ('All' or specific category)
 * @returns {Array} ranked and filtered medicines
 */
export const searchMedicines = ({ query = '', category = 'All' } = {}) => {
  const cleanQuery = normalizeText(query);
  const selectedCategory = category || 'All';

  // 1. Expand query tokens with Bengali synonyms if applicable
  const searchTokens = new Set();
  if (cleanQuery) {
    searchTokens.add(cleanQuery);
    cleanQuery.split(' ').filter(Boolean).forEach((t) => searchTokens.add(t));

    // Check Bengali synonyms
    for (const [bnKeyword, enTerms] of Object.entries(BENGALI_SYNONYMS)) {
      if (cleanQuery.includes(bnKeyword.toLowerCase()) || bnKeyword.toLowerCase().includes(cleanQuery)) {
        enTerms.forEach((term) => searchTokens.add(term.toLowerCase()));
      }
    }
  }

  const tokenList = Array.from(searchTokens);

  // 2. Filter and score medicines
  const scoredResults = [];

  for (const med of medicineDataset) {
    // Category check
    const matchesCategory =
      selectedCategory === 'All' ||
      (med.category && med.category.toLowerCase() === selectedCategory.toLowerCase());

    if (!matchesCategory) {
      continue;
    }

    if (!cleanQuery) {
      scoredResults.push({ medicine: med, score: 1 });
      continue;
    }

    // Calculate score
    const score = calculateSearchScore(med, tokenList, cleanQuery);

    if (score > 0) {
      scoredResults.push({ medicine: med, score });
    }
  }

  // 3. Rank results by score descending, then alphabetically
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.medicine.name.localeCompare(b.medicine.name);
  });

  return scoredResults.map((item) => item.medicine);
};

export default {
  getAllMedicines,
  getMedicineById,
  getMedicineCategories,
  getAntibiotics,
  searchMedicines,
  BENGALI_SYNONYMS,
};
