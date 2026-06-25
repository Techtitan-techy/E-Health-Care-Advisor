            // Disease Database
const diseases = [
  {
    id: 'flu',
    name: 'Common Flu (Influenza)',
    symptoms: ['cough', 'fever', 'sore_throat', 'fatigue', 'runny_nose', 'muscle_aches'],
    severity: 'moderate',
    description: 'A contagious viral infection affecting the respiratory tract. Typically resolves within 7-10 days.',
    otcMedicines: ['Ibuprofen', 'Paracetamol', 'Cough drops', 'Decongestants'],
    prevention: 'Get annual flu vaccine, maintain hand hygiene, avoid sick individuals, practice respiratory etiquette'
  },
  {
    id: 'covid',
    name: 'COVID-19 (Coronavirus)',
    symptoms: ['fever', 'cough', 'fatigue', 'loss_of_taste', 'shortness_of_breath', 'muscle_aches'],
    severity: 'high',
    description: 'A viral respiratory infection that can range from mild to severe. Seek medical attention if symptoms worsen or breathing becomes difficult.',
    otcMedicines: ['Paracetamol', 'Rest', 'Hydration', 'Oxygen therapy (if severe)'],
    prevention: 'Get vaccinated, maintain social distance, wear masks in crowded areas, practice good hygiene'
  },
  {
    id: 'cold',
    name: 'Common Cold',
    symptoms: ['sneezing', 'runny_nose', 'sore_throat', 'mild_cough', 'watery_eyes'],
    severity: 'low',
    description: 'A viral infection of your nose and throat (upper respiratory tract). Usually harmless, though it might not feel that way.',
    otcMedicines: ['Decongestants', 'Pain relievers', 'Cough syrup', 'Zinc supplements'],
    prevention: 'Wash hands often, avoid touching face, disinfect surfaces, avoid close contact with sick people'
  },
  {
    id: 'strep_throat',
    name: 'Strep Throat',
    symptoms: ['sore_throat', 'difficulty_swallowing', 'fever', 'swollen_lymph_nodes'],
    severity: 'moderate',
    description: 'A bacterial infection that can make your throat feel sore and scratchy. Requires antibiotics to prevent complications.',
    otcMedicines: ['Ibuprofen', 'Throat lozenges', 'Salt water gargle'],
    prevention: 'Avoid sharing utensils, wash hands, replace toothbrush after diagnosis'
  },
  {
    id: 'asthma',
    name: 'Asthma',
    symptoms: ['shortness_of_breath', 'wheezing', 'chest_tightness', 'cough'],
    severity: 'moderate',
    description: 'A condition in which your airways narrow and swell and may produce extra mucus, making breathing difficult.',
    otcMedicines: ['Inhalers (Albuterol)', 'Avoid triggers', 'Peak flow monitoring'],
    prevention: 'Identify and avoid triggers (dust, pollen), stay active, monitor breathing'
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    symptoms: ['productive_cough', 'fever', 'chills', 'shortness_of_breath', 'chest_pain', 'fatigue'],
    severity: 'high',
    description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus.',
    otcMedicines: ['Hydration', 'Rest', 'Cough medicine (prescribed antibiotics usually needed)'],
    prevention: 'Get vaccinated (Pneumococcal), wash hands, don\'t smoke'
  },
  {
    id: 'food_poisoning',
    name: 'Food Poisoning',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever'],
    severity: 'moderate',
    description: 'Illness caused by eating contaminated food. Usually resolves within a few days with rest and hydration.',
    otcMedicines: ['Bismuth subsalicylate (Pepto-Bismol)', 'Electrolyte drinks', 'Probiotics'],
    prevention: 'Wash hands/surfaces, separate raw foods, cook to right temperature, refrigerate promptly'
  },
  {
    id: 'allergies',
    name: 'Seasonal Allergies (Hay Fever)',
    symptoms: ['sneezing', 'runny_nose', 'watery_eyes', 'itchy_throat', 'fatigue'],
    severity: 'low',
    description: 'An allergic response to outdoor or indoor allergens, such as pollen, dust mites, or tiny flecks of skin and saliva shed by cats, dogs, and other animals with fur or feathers.',
    otcMedicines: ['Antihistamines (Loratadine, Cetirizine)', 'Nasal steroids', 'Decongestants'],
    prevention: 'Stay indoors when pollen counts are high, use air purifiers, wash bedding in hot water'
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection (UTI)',
    symptoms: ['burning_urination', 'frequent_urination', 'pelvic_pain', 'cloudy_urine'],
    severity: 'moderate',
    description: 'An infection in any part of your urinary system — your kidneys, ureters, bladder and urethra. Most involve the lower urinary tract.',
    otcMedicines: ['Phenazopyridine (for pain)', 'Cranberry supplements', 'Hydration'],
    prevention: 'Drink plenty of water, wipe from front to back, urinate after intercourse'
  },
  {
    id: 'migraine',
    name: 'Migraine Headache',
    symptoms: ['headache', 'nausea', 'light_sensitivity', 'fatigue', 'blurred_vision'],
    severity: 'moderate',
    description: 'A neurological condition causing intense, throbbing headaches often on one side of the head.',
    otcMedicines: ['Aspirin', 'Ibuprofen', 'Sumatriptan', 'Triptans'],
    prevention: 'Identify triggers, maintain regular sleep, manage stress, avoid caffeine, practice relaxation techniques'
  },
  {
    id: 'gerd',
    name: 'GERD (Acid Reflux)',
    symptoms: ['heartburn', 'chest_pain', 'nausea', 'difficulty_swallowing'],
    severity: 'moderate',
    description: 'Gastroesophageal reflux disease affecting the digestive system. Stomach acid flows back into the esophagus.',
    otcMedicines: ['Antacids', 'H2 Blockers', 'Omeprazole', 'Famotidine'],
    prevention: 'Eat smaller meals, avoid spicy/fatty food, limit caffeine/alcohol, elevate head while sleeping'
  },
  {
    id: 'hypertension',
    name: 'High Blood Pressure (Hypertension)',
    symptoms: ['headache', 'dizziness', 'chest_pain', 'fatigue', 'blurred_vision'],
    severity: 'high',
    description: 'Persistent elevated blood pressure (≥130/80 mmHg) requiring ongoing management and monitoring.',
    otcMedicines: ['Regular monitoring', 'Lifestyle changes', 'Prescribed ACE inhibitors/Beta blockers'],
    prevention: 'Regular exercise, reduce salt intake, manage stress, maintain healthy weight, limit alcohol'
  },
  {
    id: 'diabetes',
    name: 'Diabetes (Type 2)',
    symptoms: ['excessive_thirst', 'fatigue', 'frequent_urination', 'blurred_vision', 'slow_healing_sores'],
    severity: 'high',
    description: 'A metabolic disorder affecting blood sugar levels. Requires long-term management and lifestyle changes.',
    otcMedicines: ['Dietary management', 'Metformin', 'Regular blood sugar monitoring', 'Insulin (if severe)'],
    prevention: 'Maintain healthy weight, exercise 150+ min/week, consume balanced diet, avoid sugary drinks'
  },
  {
    id: 'heart_attack',
    name: 'Heart Attack (Myocardial Infarction)',
    symptoms: ['chest_pain', 'shortness_of_breath', 'nausea', 'sweating', 'arm_pain', 'jaw_pain'],
    severity: 'critical',
    description: 'A medical emergency where the supply of blood to the heart is suddenly blocked, usually by a blood clot.',
    otcMedicines: ['Aspirin (chew while waiting for help)', 'Emergency dispatch immediate call'],
    prevention: 'Maintain healthy heart diet, exercise regularly, manage blood pressure, don\'t smoke'
  },
  {
    id: 'stroke',
    name: 'Stroke (Cerebrovascular Accident)',
    symptoms: ['facial_droop', 'arm_weakness', 'slurred_speech', 'confusion', 'headache', 'blurred_vision'],
    severity: 'critical',
    description: 'A medical emergency that occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.',
    otcMedicines: ['None', 'CALL EMERGENCY SERVICES IMMEDIATELY - Time is Brain'],
    prevention: 'Control high blood pressure, lower cholesterol, manage diabetes, quit smoking'
  },
  {
    id: 'anxiety',
    name: 'Anxiety Disorder',
    symptoms: ['nervousness', 'rapid_heartbeat', 'sweating', 'difficulty_concentrating'],
    severity: 'moderate',
    description: 'A mental health condition causing excessive worry, fear, and physical symptoms affecting daily life.',
    otcMedicines: ['Breathing exercises', 'Meditation', 'Counseling', 'Cognitive behavioral therapy (CBT)'],
    prevention: 'Practice mindfulness, regular exercise, adequate sleep, limit caffeine, seek professional therapy'
  },
  {
    id: 'insomnia',
    name: 'Insomnia (Sleep Disorder)',
    symptoms: ['fatigue', 'difficulty_concentrating', 'irritability'],
    severity: 'moderate',
    description: 'Sleep disorder affecting rest and recovery quality. Difficulty falling or staying asleep.',
    otcMedicines: ['Melatonin', 'Sleep hygiene', 'Valerian root', 'Magnesium supplements'],
    prevention: 'Maintain regular sleep schedule, avoid screens 1h before bed, limit caffeine, create dark bedroom'
  }
];

// Hospital Database with Real Major Medical Centers
const hospitals = [
  {
    id: 1,
    name: 'Apollo Hospitals - Jubilee Hills',
    location: 'Jubilee Hills, Hyderabad',
    address: 'Road No 72, Opp. Bharatiya Vidya Bhavan, Jubilee Hills, Hyderabad, Telangana 500033',
    phone: '+91-40-2360-7777',
    website: 'https://www.apollohospitals.com/locations/india/hyderabad/jubilee-hills',
    emergency: true,
    departments: ['Emergency & Trauma', 'Cardiology', 'Neurology', 'Oncology', 'Transplantation', 'Orthopedics'],
    rating: 4.8,
    hours: '24/7',
    type: 'Multi-Specialty Hospital'
  },
  {
    id: 2,
    name: 'Yashoda Hospitals - Secunderabad',
    location: 'Secunderabad, Hyderabad',
    address: 'Alexander Rd, Kummari Guda, Shivaji Nagar, Secunderabad, Telangana 500003',
    phone: '+91-40-4567-4567',
    website: 'https://www.yashodahospitals.com',
    emergency: true,
    departments: ['Emergency', 'Heart Institute', 'Neuro Institute', 'Cancer Institute', 'Liver Transplant'],
    rating: 4.7,
    hours: '24/7',
    type: 'Multi-Specialty Hospital'
  },
  {
    id: 3,
    name: 'KIMS Hospitals - Secunderabad',
    location: 'Secunderabad, Hyderabad',
    address: '1-8-31/1, Minister Rd, Krishna Nagar, Secunderabad, Telangana 500003',
    phone: '+91-40-4488-5000',
    website: 'https://www.kimshospitals.com',
    emergency: true,
    departments: ['Emergency & Trauma', 'Cardiac Sciences', 'Neuro Sciences', 'Orthopedics', 'Pediatrics'],
    rating: 4.8,
    hours: '24/7',
    type: 'Multi-Specialty Hospital'
  },
  {
    id: 4,
    name: 'CARE Hospitals - Banjara Hills',
    location: 'Banjara Hills, Hyderabad',
    address: 'Road No 1, Banjara Hills, Hyderabad, Telangana 500034',
    phone: '+91-40-6165-6565',
    website: 'https://www.carehospitals.com',
    emergency: true,
    departments: ['Emergency', 'Cardiology', 'Nephrology', 'Neurosurgery', 'Women & Child Institute'],
    rating: 4.6,
    hours: '24/7',
    type: 'Multi-Specialty Hospital'
  },
  {
    id: 5,
    name: 'AIG Hospitals - Gachibowli',
    location: 'Gachibowli, Hyderabad',
    address: '1-66/A4, Mindspace Rd, Gachibowli, Hyderabad, Telangana 500032',
    phone: '+91-40-4244-4222',
    website: 'https://www.aighospitals.com',
    emergency: true,
    departments: ['Emergency', 'Gastroenterology', 'Cardiology', 'Oncology', 'Organ Transplant'],
    rating: 4.9,
    hours: '24/7',
    type: 'Multi-Specialty Hospital'
  }
];

// Symptoms Reference
const symptoms = [
  { id: 'cough', label: 'Coughing', category: 'respiratory' },
  { id: 'fever', label: 'Fever / High Temperature', category: 'general' },
  { id: 'sore_throat', label: 'Sore Throat', category: 'respiratory' },
  { id: 'fatigue', label: 'Fatigue / Tiredness', category: 'general' },
  { id: 'runny_nose', label: 'Runny / Stuffy Nose', category: 'respiratory' },
  { id: 'loss_of_taste', label: 'Loss of Taste or Smell', category: 'general' },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', category: 'respiratory' },
  { id: 'headache', label: 'Headache', category: 'neurological' },
  { id: 'nausea', label: 'Nausea / Upset Stomach', category: 'digestive' },
  { id: 'light_sensitivity', label: 'Sensitivity to Light', category: 'neurological' },
  { id: 'heartburn', label: 'Heartburn / Acid Reflux', category: 'digestive' },
  { id: 'chest_pain', label: 'Chest Pain / Pressure', category: 'cardiovascular' },
  { id: 'difficulty_swallowing', label: 'Difficulty Swallowing', category: 'digestive' },
  { id: 'dizziness', label: 'Dizziness / Lightheadedness', category: 'neurological' },
  { id: 'excessive_thirst', label: 'Excessive Thirst', category: 'general' },
  { id: 'frequent_urination', label: 'Frequent Urination', category: 'digestive' },
  { id: 'blurred_vision', label: 'Blurred or Double Vision', category: 'neurological' },
  { id: 'nervousness', label: 'Nervousness or Anxiety', category: 'mental' },
  { id: 'rapid_heartbeat', label: 'Rapid or Irregular Heartbeat', category: 'cardiovascular' },
  { id: 'sweating', label: 'Excessive Sweating', category: 'general' },
  { id: 'difficulty_concentrating', label: 'Difficulty Concentrating', category: 'mental' },
  { id: 'irritability', label: 'Irritability or Mood Changes', category: 'mental' },
  { id: 'muscle_aches', label: 'Muscle Aches or Body Pains', category: 'general' },
  { id: 'sneezing', label: 'Sneezing', category: 'respiratory' },
  { id: 'watery_eyes', label: 'Watery / Itchy Eyes', category: 'respiratory' },
  { id: 'wheezing', label: 'Wheezing Sound', category: 'respiratory' },
  { id: 'chest_tightness', label: 'Chest Tightness', category: 'respiratory' },
  { id: 'productive_cough', label: 'Cough with Phlegm/Mucus', category: 'respiratory' },
  { id: 'chills', label: 'Chills / Shaking', category: 'general' },
  { id: 'abdominal_pain', label: 'Abdominal Pain / Cramps', category: 'digestive' },
  { id: 'diarrhea', label: 'Diarrhea', category: 'digestive' },
  { id: 'vomiting', label: 'Vomiting', category: 'digestive' },
  { id: 'itchy_throat', label: 'Itchy Throat', category: 'respiratory' },
  { id: 'burning_urination', label: 'Pain/Burning during Urination', category: 'digestive' },
  { id: 'pelvic_pain', label: 'Pelvic Pain', category: 'general' },
  { id: 'cloudy_urine', label: 'Cloudy or Blood-tinged Urine', category: 'digestive' },
  { id: 'arm_pain', label: 'Pain in Left or Right Arm', category: 'cardiovascular' },
  { id: 'jaw_pain', label: 'Jaw or Neck Pain', category: 'cardiovascular' },
  { id: 'facial_droop', label: 'Facial Droop or Numbness', category: 'neurological' },
  { id: 'arm_weakness', label: 'Weakness in One Arm', category: 'neurological' },
  { id: 'slurred_speech', label: 'Slurred Speech / Trouble Talking', category: 'neurological' },
  { id: 'confusion', label: 'Sudden Confusion or Disorientation', category: 'neurological' },
  { id: 'slow_healing_sores', label: 'Slow-healing Sores or Cuts', category: 'general' },
  { id: 'swollen_lymph_nodes', label: 'Swollen Lymph Nodes in Neck', category: 'general' },
  { id: 'mild_cough', label: 'Mild/Dry Cough', category: 'respiratory' }
];

export { diseases, hospitals, symptoms };
