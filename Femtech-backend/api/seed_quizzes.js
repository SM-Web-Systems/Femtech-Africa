const { PrismaClient } = require('./generated/prisma-client');
const prisma = new PrismaClient();

const quizzes = [
  {
    title: 'First Trimester Essentials',
    description: 'Learn about the crucial first 12 weeks of pregnancy',
    category: 'pregnancy_basics',
    difficulty: 'beginner',
    time_limit_mins: 8,
    pass_threshold: 60,
    reward_amount: 20,
    questions: [
      {
        questionText: 'When does the first trimester end?',
        questionType: 'multiple_choice',
        options: ['Week 8', 'Week 10', 'Week 12', 'Week 14'],
        correct_answer: 2,
        explanation: 'The first trimester lasts from week 1 to week 12 of pregnancy.',
        sortOrder: 1
      },
      {
        questionText: 'What is the most common symptom in the first trimester?',
        questionType: 'multiple_choice',
        options: ['Back pain', 'Morning sickness', 'Swollen feet', 'Braxton Hicks'],
        correct_answer: 1,
        explanation: 'Morning sickness (nausea and vomiting) is most common in the first trimester.',
        sortOrder: 2
      },
      {
        questionText: 'When should you have your first prenatal visit?',
        questionType: 'multiple_choice',
        options: ['Week 4-6', 'Week 8-10', 'Week 12-14', 'Week 16-18'],
        correct_answer: 1,
        explanation: 'Your first prenatal visit should ideally be around weeks 8-10.',
        sortOrder: 3
      },
      {
        questionText: 'Which organ starts developing first in the embryo?',
        questionType: 'multiple_choice',
        options: ['Brain', 'Heart', 'Lungs', 'Liver'],
        correct_answer: 1,
        explanation: 'The heart is one of the first organs to develop and starts beating around week 5.',
        sortOrder: 4
      }
    ]
  },
  {
    title: 'Baby Kick Counting',
    description: 'Understanding fetal movement and kick counting',
    category: 'pregnancy_basics',
    difficulty: 'beginner',
    time_limit_mins: 5,
    pass_threshold: 70,
    reward_amount: 15,
    questions: [
      {
        questionText: 'When should you start counting baby kicks?',
        questionType: 'multiple_choice',
        options: ['Week 20', 'Week 24', 'Week 28', 'Week 32'],
        correct_answer: 2,
        explanation: 'Kick counting is typically recommended starting around week 28.',
        sortOrder: 1
      },
      {
        questionText: 'How many movements should you feel in 2 hours?',
        questionType: 'multiple_choice',
        options: ['5 movements', '10 movements', '15 movements', '20 movements'],
        correct_answer: 1,
        explanation: 'You should feel at least 10 movements in 2 hours during active times.',
        sortOrder: 2
      },
      {
        questionText: 'What should you do if you notice decreased movement?',
        questionType: 'multiple_choice',
        options: ['Wait until tomorrow', 'Drink cold water and lie down', 'Contact your healthcare provider', 'Both B and C'],
        correct_answer: 3,
        explanation: 'Try drinking cold water and lying down, but contact your provider if movements do not increase.',
        sortOrder: 3
      }
    ]
  },
  {
    title: 'Breastfeeding Basics',
    description: 'Prepare for breastfeeding your newborn',
    category: 'breastfeeding',
    difficulty: 'intermediate',
    time_limit_mins: 10,
    pass_threshold: 70,
    reward_amount: 30,
    questions: [
      {
        questionText: 'What is colostrum?',
        questionType: 'multiple_choice',
        options: ['A type of formula', 'First milk produced after birth', 'A breastfeeding position', 'A breast pump brand'],
        correct_answer: 1,
        explanation: 'Colostrum is the first milk, rich in antibodies and nutrients for your newborn.',
        sortOrder: 1
      },
      {
        questionText: 'How often should a newborn breastfeed?',
        questionType: 'multiple_choice',
        options: ['Every 4-5 hours', 'Every 2-3 hours', 'Once every 6 hours', 'Only when crying'],
        correct_answer: 1,
        explanation: 'Newborns typically need to breastfeed every 2-3 hours, or 8-12 times per day.',
        sortOrder: 2
      },
      {
        questionText: 'Which is a sign of a good latch?',
        questionType: 'multiple_choice',
        options: ['Pain throughout feeding', 'Baby lips flanged outward', 'Clicking sounds', 'Baby falls asleep immediately'],
        correct_answer: 1,
        explanation: 'A good latch includes lips flanged outward like fish lips, not tucked in.',
        sortOrder: 3
      },
      {
        questionText: 'What does WHO recommend for exclusive breastfeeding?',
        questionType: 'multiple_choice',
        options: ['3 months', '6 months', '9 months', '12 months'],
        correct_answer: 1,
        explanation: 'WHO recommends exclusive breastfeeding for the first 6 months of life.',
        sortOrder: 4
      },
      {
        questionText: 'Which vitamin supplement is recommended for breastfed babies?',
        questionType: 'multiple_choice',
        options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
        correct_answer: 2,
        explanation: 'Vitamin D supplements are recommended for breastfed babies.',
        sortOrder: 5
      }
    ]
  },
  {
    title: 'Warning Signs During Pregnancy',
    description: 'Know when to seek immediate medical help',
    category: 'danger_signs',
    difficulty: 'intermediate',
    time_limit_mins: 8,
    pass_threshold: 80,
    reward_amount: 35,
    questions: [
      {
        questionText: 'Which symptom requires immediate medical attention?',
        questionType: 'multiple_choice',
        options: ['Mild nausea', 'Occasional headache', 'Vaginal bleeding', 'Food cravings'],
        correct_answer: 2,
        explanation: 'Vaginal bleeding during pregnancy should always be evaluated immediately.',
        sortOrder: 1
      },
      {
        questionText: 'Severe headache with vision changes could indicate:',
        questionType: 'multiple_choice',
        options: ['Normal pregnancy symptom', 'Preeclampsia', 'Dehydration only', 'Allergies'],
        correct_answer: 1,
        explanation: 'Severe headache with vision changes can be signs of preeclampsia, a serious condition.',
        sortOrder: 2
      },
      {
        questionText: 'What is a normal fetal heart rate?',
        questionType: 'multiple_choice',
        options: ['60-80 bpm', '80-100 bpm', '110-160 bpm', '180-200 bpm'],
        correct_answer: 2,
        explanation: 'Normal fetal heart rate is between 110-160 beats per minute.',
        sortOrder: 3
      },
      {
        questionText: 'Which is NOT a warning sign of preterm labor?',
        questionType: 'multiple_choice',
        options: ['Regular contractions before 37 weeks', 'Lower back pain', 'Increased vaginal discharge', 'Mild heartburn'],
        correct_answer: 3,
        explanation: 'Mild heartburn is common and not a sign of preterm labor.',
        sortOrder: 4
      }
    ]
  },
  {
    title: 'Labor and Delivery Preparation',
    description: 'What to expect during labor and delivery',
    category: 'labor_delivery',
    difficulty: 'intermediate',
    time_limit_mins: 10,
    pass_threshold: 70,
    reward_amount: 30,
    questions: [
      {
        questionText: 'What is a sign that labor is starting?',
        questionType: 'multiple_choice',
        options: ['Regular contractions getting closer together', 'Feeling tired', 'Mild back pain', 'Increased appetite'],
        correct_answer: 0,
        explanation: 'Regular contractions that get closer together and stronger indicate true labor.',
        sortOrder: 1
      },
      {
        questionText: 'What is the "bloody show"?',
        questionType: 'multiple_choice',
        options: ['Heavy bleeding', 'Mucus plug with blood streaks', 'A medical procedure', 'A type of contraction'],
        correct_answer: 1,
        explanation: 'The bloody show is the mucus plug tinged with blood, signaling labor may start soon.',
        sortOrder: 2
      },
      {
        questionText: 'When should you go to the hospital during labor?',
        questionType: 'multiple_choice',
        options: ['At the first contraction', 'When contractions are 5 minutes apart for 1 hour', 'Only when water breaks', 'After 24 hours of contractions'],
        correct_answer: 1,
        explanation: 'The 5-1-1 rule: contractions 5 minutes apart, lasting 1 minute, for 1 hour.',
        sortOrder: 3
      },
      {
        questionText: 'What does effacement mean?',
        questionType: 'multiple_choice',
        options: ['Baby turning head down', 'Cervix thinning', 'Water breaking', 'Contractions stopping'],
        correct_answer: 1,
        explanation: 'Effacement is the thinning and shortening of the cervix in preparation for delivery.',
        sortOrder: 4
      }
    ]
  },
  {
    title: 'Newborn Care Essentials',
    description: 'Basic care for your new baby',
    category: 'newborn_care',
    difficulty: 'beginner',
    time_limit_mins: 8,
    pass_threshold: 70,
    reward_amount: 25,
    questions: [
      {
        questionText: 'How often should a newborn be fed?',
        questionType: 'multiple_choice',
        options: ['Every 1-2 hours', 'Every 2-3 hours', 'Every 4-5 hours', 'Every 6 hours'],
        correct_answer: 1,
        explanation: 'Newborns need to feed every 2-3 hours, or 8-12 times per day.',
        sortOrder: 1
      },
      {
        questionText: 'What is the safest sleep position for a baby?',
        questionType: 'multiple_choice',
        options: ['On their stomach', 'On their side', 'On their back', 'Any position is fine'],
        correct_answer: 2,
        explanation: 'Babies should always sleep on their back to reduce SIDS risk.',
        sortOrder: 2
      },
      {
        questionText: 'How many wet diapers should a newborn have per day?',
        questionType: 'multiple_choice',
        options: ['2-3', '4-5', '6-8', '10-12'],
        correct_answer: 2,
        explanation: 'A well-fed newborn should have 6-8 wet diapers per day.',
        sortOrder: 3
      },
      {
        questionText: 'When does the umbilical cord stump usually fall off?',
        questionType: 'multiple_choice',
        options: ['1-3 days', '1-3 weeks', '1-2 months', '3-4 months'],
        correct_answer: 1,
        explanation: 'The umbilical cord stump typically falls off within 1-3 weeks.',
        sortOrder: 4
      }
    ]
  },
  {
    title: 'Mental Health During Pregnancy',
    description: 'Taking care of your emotional wellbeing',
    category: 'mental_health',
    difficulty: 'beginner',
    time_limit_mins: 8,
    pass_threshold: 60,
    reward_amount: 20,
    questions: [
      {
        questionText: 'What percentage of pregnant women experience anxiety?',
        questionType: 'multiple_choice',
        options: ['5%', '10-15%', '20-25%', '50%'],
        correct_answer: 1,
        explanation: 'About 10-15% of pregnant women experience significant anxiety.',
        sortOrder: 1
      },
      {
        questionText: 'Which is a healthy way to manage pregnancy stress?',
        questionType: 'multiple_choice',
        options: ['Ignoring your feelings', 'Talking to someone you trust', 'Staying isolated', 'Skipping meals'],
        correct_answer: 1,
        explanation: 'Talking to a trusted person about your feelings is a healthy coping strategy.',
        sortOrder: 2
      },
      {
        questionText: 'What is perinatal depression?',
        questionType: 'multiple_choice',
        options: ['Depression only after birth', 'Depression during and after pregnancy', 'Feeling sad for one day', 'Normal mood swings'],
        correct_answer: 1,
        explanation: 'Perinatal depression can occur during pregnancy and up to a year after birth.',
        sortOrder: 3
      },
      {
        questionText: 'When should you seek help for mood changes?',
        questionType: 'multiple_choice',
        options: ['Only if you feel like hurting yourself', 'When symptoms last more than 2 weeks', 'Never, its normal', 'Only after delivery'],
        correct_answer: 1,
        explanation: 'If mood symptoms last more than 2 weeks, its important to talk to a healthcare provider.',
        sortOrder: 4
      }
    ]
  }
];

async function seedQuizzes() {
  console.log('Seeding quizzes...');
  
  for (const quizData of quizzes) {
    const { questions, ...quiz } = quizData;
    
    const existing = await prisma.quiz.findFirst({
      where: { title: quiz.title }
    });
    
    if (existing) {
      console.log(`Quiz "${quiz.title}" already exists, skipping...`);
      continue;
    }
    
    const created = await prisma.quiz.create({
      data: {
        ...quiz,
        questions: {
          create: questions
        }
      },
      include: { questions: true }
    });
    
    console.log(`Created quiz: ${created.title} (${created.questions.length} questions)`);
  }
  
  console.log('Done seeding quizzes!');
}

seedQuizzes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
