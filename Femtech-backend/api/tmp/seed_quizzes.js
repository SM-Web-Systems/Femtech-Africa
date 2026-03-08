const { PrismaClient } = require('./generated/prisma-client');
const prisma = new PrismaClient();

const quizzes = [
  {
    title: 'Pregnancy Nutrition Basics',
    description: 'Test your knowledge about healthy eating during pregnancy',
    category: 'nutrition',
    difficulty: 'beginner',
    time_limit_mins: 10,
    pass_threshold: 70,
    reward_amount: 25,
    questions: [
      {
        questionText: 'Which vitamin is essential for preventing neural tube defects?',
        questionType: 'multiple_choice',
        options: ['Vitamin A', 'Vitamin C', 'Folic Acid', 'Vitamin D'],
        correct_answer: 2,
        explanation: 'Folic acid (Vitamin B9) is crucial for preventing neural tube defects like spina bifida.',
        sortOrder: 1
      },
      {
        questionText: 'How much extra calories do you need daily during the second trimester?',
        questionType: 'multiple_choice',
        options: ['100 calories', '340 calories', '500 calories', '1000 calories'],
        correct_answer: 1,
        explanation: 'During the second trimester, you need about 340 extra calories per day.',
        sortOrder: 2
      },
      {
        questionText: 'Which of these foods should be avoided during pregnancy?',
        questionType: 'multiple_choice',
        options: ['Cooked eggs', 'Pasteurized milk', 'Raw sushi', 'Well-done steak'],
        correct_answer: 2,
        explanation: 'Raw fish can contain parasites and bacteria harmful to your baby.',
        sortOrder: 3
      },
      {
        questionText: 'Iron is important during pregnancy because it:',
        questionType: 'multiple_choice',
        options: ['Prevents morning sickness', 'Helps produce extra blood', 'Reduces stretch marks', 'Improves sleep'],
        correct_answer: 1,
        explanation: 'Iron helps your body produce the extra blood needed during pregnancy.',
        sortOrder: 4
      },
      {
        questionText: 'How many glasses of water should a pregnant woman drink daily?',
        questionType: 'multiple_choice',
        options: ['4-5 glasses', '6-7 glasses', '8-10 glasses', '12-15 glasses'],
        correct_answer: 2,
        explanation: 'Pregnant women should drink 8-10 glasses (about 2.3 liters) of water daily.',
        sortOrder: 5
      }
    ]
  },
  {
    title: 'First Trimester Essentials',
    description: 'Learn about the crucial first 12 weeks of pregnancy',
    category: 'pregnancy',
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
    category: 'wellness',
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
        explanation: 'Try drinking cold water and lying down, but contact your provider if movements don\'t increase.',
        sortOrder: 3
      }
    ]
  },
  {
    title: 'Breastfeeding Basics',
    description: 'Prepare for breastfeeding your newborn',
    category: 'education',
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
        options: ['Pain throughout feeding', 'Baby\'s lips flanged outward', 'Clicking sounds', 'Baby falls asleep immediately'],
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
    category: 'clinical',
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
        questionText: 'Which is NOT a warning sign of preterm labor ?',
        questionType: 'multiple_choice',
        options: ['Regular contractions before 37 weeks', 'Lower back pain', 'Increased vaginal discharge', 'Mild heartburn'],
        correct_answer: 3,
        explanation: 'Mild heartburn is common and not a sign of preterm labor.',
        sortOrder: 4
      }
    ]
  }
];

async function seedQuizzes() {
  console.log('Seeding quizzes...');
  
  for (const quizData of quizzes) {
    const { questions, ...quiz } = quizData;
    
    // Check if quiz already exists
    const existing = await prisma.quiz.findFirst({
      where: { title: quiz.title }
    });
    
    if (existing) {
      console.log(`Quiz "${quiz.title}" already exists, skipping...`);
      continue;
    }
    
    // Create quiz with questions
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