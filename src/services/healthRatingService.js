// Clinical Wellness Calculation Engine for SYNORA Health Score

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category = 'Normal';
  let badgeColor = '#10B981';

  if (bmi < 18.5) {
    category = 'Underweight';
    badgeColor = '#F59E0B';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Healthy Weight';
    badgeColor = '#10B981';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    category = 'Overweight';
    badgeColor = '#F59E0B';
  } else {
    category = 'Obese';
    badgeColor = '#EF4444';
  }

  return {
    value: parseFloat(bmi.toFixed(1)),
    category,
    badgeColor,
  };
}

export function evaluateBloodPressure(systolic, diastolic) {
  if (!systolic || !diastolic) return null;
  const sys = parseInt(systolic, 10);
  const dia = parseInt(diastolic, 10);

  if (sys < 120 && dia < 80) {
    return { category: 'Normal', status: 'optimal', color: '#10B981' };
  } else if (sys <= 129 && dia < 80) {
    return { category: 'Elevated', status: 'warning', color: '#F59E0B' };
  } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    return { category: 'Stage 1 Hypertension', status: 'warning', color: '#F59E0B' };
  } else if (sys >= 140 || dia >= 90) {
    return { category: 'Stage 2 Hypertension', status: 'danger', color: '#EF4444' };
  }
  return { category: 'Standard', status: 'optimal', color: '#10B981' };
}

// Compute dynamic Wellness Score (0 - 100)
export function computeSynoraHealthScore(healthProfile) {
  if (!healthProfile) {
    return {
      score: 75,
      bmi: null,
      bpStatus: null,
      breakdown: { vitals: 75, lifestyle: 75, medical: 75 },
    };
  }

  let totalScore = 100;
  let deductions = 0;

  // 1. BMI deductions
  const bmiData = calculateBMI(healthProfile.weightKg, healthProfile.heightCm);
  let bmiScore = 100;
  if (bmiData) {
    if (bmiData.value < 18.5) {
      deductions += 8;
      bmiScore -= 20;
    } else if (bmiData.value >= 25 && bmiData.value < 30) {
      deductions += 8;
      bmiScore -= 20;
    } else if (bmiData.value >= 30) {
      deductions += 16;
      bmiScore -= 40;
    }
  }

  // 2. Blood Pressure deductions
  let bpScore = 100;
  const bpData = evaluateBloodPressure(healthProfile.bpSystolic, healthProfile.bpDiastolic);
  if (bpData) {
    if (bpData.category === 'Elevated') {
      deductions += 5;
      bpScore -= 15;
    } else if (bpData.category === 'Stage 1 Hypertension') {
      deductions += 12;
      bpScore -= 30;
    } else if (bpData.category === 'Stage 2 Hypertension') {
      deductions += 20;
      bpScore -= 50;
    }
  }

  // 3. Chronic Conditions
  let conditionCount = (healthProfile.conditions || []).length;
  deductions += Math.min(conditionCount * 6, 20);

  // 4. Lifestyle Factors
  let lifestyleScore = 100;
  if (healthProfile.dailyActivity === 'sedentary') {
    deductions += 8;
    lifestyleScore -= 20;
  } else if (healthProfile.dailyActivity === 'active') {
    deductions -= 4; // Bonus
  }

  if (healthProfile.sleepHours && (healthProfile.sleepHours < 6 || healthProfile.sleepHours > 9)) {
    deductions += 6;
    lifestyleScore -= 15;
  }

  if (healthProfile.waterLiters && healthProfile.waterLiters < 2) {
    deductions += 4;
    lifestyleScore -= 10;
  }

  if (healthProfile.smoking === 'yes') {
    deductions += 14;
    lifestyleScore -= 30;
  }

  // Final score clamping
  const finalScore = Math.max(15, Math.min(98, Math.round(totalScore - deductions)));

  return {
    score: finalScore,
    bmi: bmiData,
    bpStatus: bpData,
    breakdown: {
      vitals: Math.max(30, Math.min(100, Math.round((bmiScore + bpScore) / 2))),
      lifestyle: Math.max(20, Math.min(100, lifestyleScore)),
      chronic: Math.max(20, 100 - conditionCount * 15),
    },
  };
}

// Map score to configured Admin Rating Bracket
export function matchRatingBracket(score, ratingBrackets) {
  if (!ratingBrackets || ratingBrackets.length === 0) {
    return {
      status: 'Wellness Status',
      message: 'Based on your submitted parameters, your indicators are recorded.',
      recommendations: ['Stay hydrated', 'Maintain regular physical activity'],
      tips: ['Schedule a routine health checkup'],
      badgeColor: '#00A896',
    };
  }

  const matched = ratingBrackets.find(
    (bracket) => score >= bracket.minScore && score <= bracket.maxScore
  );

  return matched || ratingBrackets[ratingBrackets.length - 1];
}
