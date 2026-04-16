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
    name: 'Mayo Clinic - Rochester',
    location: 'Rochester, Minnesota',
    address: '200 First St SW, Rochester, MN 55905',
    phone: '+1-507-538-3270',
    website: 'https://www.mayoclinic.org',
    emergency: true,
    departments: ['Emergency & Trauma', 'Cardiology', 'Neurology', 'Oncology', 'Transplantation', 'Orthopedics', 'Pediatrics'],
    rating: 4.9,
    hours: '24/7',
    type: 'Tertiary Care Center'
  },
  {
    id: 2,
    name: 'Johns Hopkins Hospital',
    location: 'Baltimore, Maryland',
    address: '600 N Wolfe St, Baltimore, MD 21287',
    phone: '+1-410-955-5000',
    website: 'https://www.hopkinsmedicine.org',
    emergency: true,
    departments: ['Emergency', 'Cardiac Surgery', 'Neurosurgery', 'Pediatrics', 'Oncology', 'Psychiatry', 'General Surgery'],
    rating: 4.9,
    hours: '24/7',
    type: 'Academic Medical Center'
  },
  {
    id: 3,
    name: 'Cleveland Clinic',
    location: 'Cleveland, Ohio',
    address: '9500 Euclid Ave, Cleveland, OH 44195',
    phone: '+1-216-444-2200',
    website: 'https://www.clevelandclinic.org',
    emergency: true,
    departments: ['Emergency & Trauma', 'Heart & Vascular', 'Neurology', 'Orthopedics', 'Cancer Care', 'Primary Care', 'Urgent Care'],
    rating: 4.8,
    hours: '24/7',
    type: 'Specialty Hospital'
  },
  {
    id: 4,
    name: 'Stanford Health - Stanford Hospital',
    location: 'Palo Alto, California',
    address: '300 Pasteur Drive, Palo Alto, CA 94304',
    phone: '+1-650-723-4000',
    website: 'https://www.stanfordhealthcare.org',
    emergency: true,
    departments: ['Emergency Medicine', 'Cardiology', 'Oncology', 'Neurosurgery', 'Trauma Center', 'Transplant', 'Women\'s Health'],
    rating: 4.8,
    hours: '24/7',
    type: 'Academic Medical Center'
  },
  {
    id: 5,
    name: 'UCLA Health - Ronald Reagan Medical Center',
    location: 'Los Angeles, California',
    address: '757 Westwood Blvd, Los Angeles, CA 90095',
    phone: '+1-310-825-9111',
    website: 'https://www.uclahealth.org',
    emergency: true,
    departments: ['Emergency & Trauma', 'Cardiac Care', 'Cancer', 'Neurosurgery', 'Pediatrics', 'Psychiatry', 'Transplant Services'],
    rating: 4.7,
    hours: '24/7',
    type: 'Academic Medical Center'
  },
  {
    id: 6,
    name: 'Massachusetts General Hospital',
    location: 'Boston, Massachusetts',
    address: '55 Fruit Street, Boston, MA 02114',
    phone: '+1-617-726-2000',
    website: 'https://www.massgeneral.org',
    emergency: true,
    departments: ['Emergency Department', 'Cardiac Surgery', 'Neurology', 'Oncology', 'Trauma Center', 'Surgery', 'Pediatrics'],
    rating: 4.8,
    hours: '24/7',
    type: 'Teaching Hospital'
  },
  {
    id: 7,
    name: 'NYU Langone Health - Tisch Hospital',
    location: 'New York, New York',
    address: '550 First Avenue, New York, NY 10016',
    phone: '+1-212-263-7300',
    website: 'https://nyulangone.org',
    emergency: true,
    departments: ['Emergency & Trauma', 'Cardiothoracic Surgery', 'Neurosurgery', 'Oncology', 'Pediatrics', 'Psychiatry', 'General Surgery'],
    rating: 4.7,
    hours: '24/7',
    type: 'Academic Medical Center'
  },
  {
    id: 8,
    name: 'UCSF Medical Center',
    location: 'San Francisco, California',
    address: '505 Parnassus Ave, San Francisco, CA 94143',
    phone: '+1-888-689-8273',
    website: 'https://www.ucsfhealth.org',
    emergency: true,
    departments: ['Emergency & Trauma', 'Cardiology', 'Oncology', 'Neurosurgery', 'Transplantation', 'Pediatrics', 'Psychiatry'],
    rating: 4.8,
    hours: '24/7',
    type: 'Academic Medical Center'
  },
  {
    id: 9,
    name: 'Cedars-Sinai Medical Center',
    location: 'Los Angeles, California',
    address: '8700 Beverly Blvd, Los Angeles, CA 90048',
    phone: '+1-310-423-3277',
    website: 'https://www.cedars-sinai.org',
    emergency: true,
    departments: ['Cardiology', 'Gastroenterology', 'Neurology', 'Orthopedics', 'Emergency'],
    rating: 4.8,
    hours: '24/7',
    type: 'Private Non-profit Hospital'
  },
  {
    id: 10,
    name: 'Texas Medical Center - Houston Methodist',
    location: 'Houston, Texas',
    address: '6565 Fannin St, Houston, TX 77030',
    phone: '+1-713-790-3311',
    website: 'https://www.houstonmethodist.org',
    emergency: true,
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'Transplant'],
    rating: 4.7,
    hours: '24/7',
    type: 'Academic Medical Center'
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
