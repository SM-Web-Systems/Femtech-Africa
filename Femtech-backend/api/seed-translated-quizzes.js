require('dotenv').config();
const { PrismaClient, language_code } = require('./generated/prisma-client');
const prisma = new PrismaClient();

// Translation maps for quiz content
const translations = {
  fr: {
    quizTitles: {
      'Pregnancy Nutrition Basics': 'Bases de la nutrition pendant la grossesse',
      'First Trimester Health': 'Santé du premier trimestre',
      'Safe Exercise During Pregnancy': 'Exercices sûrs pendant la grossesse',
      'Prenatal Care Essentials': 'Essentiels des soins prénataux',
      'Labor and Delivery Preparation': 'Préparation au travail et à l\'accouchement',
      'Newborn Care Basics': 'Bases des soins du nouveau-né',
      'Breastfeeding Fundamentals': 'Fondamentaux de l\'allaitement',
      'Postpartum Recovery': 'Récupération post-partum',
    },
    quizDescriptions: {
      'Test your knowledge about proper nutrition during pregnancy': 'Testez vos connaissances sur la nutrition pendant la grossesse',
      'Learn about the important health considerations in your first trimester': 'Découvrez les considérations de santé importantes au premier trimestre',
      'Discover safe ways to stay active during pregnancy': 'Découvrez des façons sûres de rester active pendant la grossesse',
      'Understanding the key aspects of prenatal care': 'Comprendre les aspects clés des soins prénataux',
      'Prepare yourself for labor and delivery': 'Préparez-vous au travail et à l\'accouchement',
      'Essential knowledge for caring for your newborn': 'Connaissances essentielles pour prendre soin de votre nouveau-né',
      'Learn the basics of successful breastfeeding': 'Apprenez les bases d\'un allaitement réussi',
      'Understanding your body\'s recovery after childbirth': 'Comprendre la récupération de votre corps après l\'accouchement',
    },
    questions: {
      'Which nutrient is essential for preventing neural tube defects?': 'Quel nutriment est essentiel pour prévenir les anomalies du tube neural ?',
      'How many additional calories per day are recommended during the second trimester?': 'Combien de calories supplémentaires par jour sont recommandées pendant le deuxième trimestre ?',
      'Which food should be avoided during pregnancy?': 'Quel aliment doit être évité pendant la grossesse ?',
      'What is the recommended daily intake of water during pregnancy?': 'Quelle est la consommation d\'eau quotidienne recommandée pendant la grossesse ?',
      'Which vitamin is important for iron absorption?': 'Quelle vitamine est importante pour l\'absorption du fer ?',
    },
    options: {
      'Folic acid': 'Acide folique',
      'Vitamin C': 'Vitamine C',
      'Calcium': 'Calcium',
      'Iron': 'Fer',
      '100 calories': '100 calories',
      '340 calories': '340 calories',
      '500 calories': '500 calories',
      '750 calories': '750 calories',
      'Raw sushi': 'Sushi cru',
      'Cooked vegetables': 'Légumes cuits',
      'Whole grains': 'Grains entiers',
      'Lean meat': 'Viande maigre',
      '4-6 glasses': '4-6 verres',
      '8-12 glasses': '8-12 verres',
      '2-3 glasses': '2-3 verres',
      '15 glasses': '15 verres',
      'Vitamin A': 'Vitamine A',
      'Vitamin B12': 'Vitamine B12',
      'Vitamin D': 'Vitamine D',
    },
  },
  sw: {
    quizTitles: {
      'Pregnancy Nutrition Basics': 'Misingi ya Lishe ya Ujauzito',
      'First Trimester Health': 'Afya ya Trimesta ya Kwanza',
      'Safe Exercise During Pregnancy': 'Mazoezi Salama Wakati wa Ujauzito',
      'Prenatal Care Essentials': 'Mambo Muhimu ya Huduma ya Kabla ya Kuzaa',
      'Labor and Delivery Preparation': 'Maandalizi ya Uchungu na Kujifungua',
      'Newborn Care Basics': 'Misingi ya Huduma ya Mtoto Mchanga',
      'Breastfeeding Fundamentals': 'Misingi ya Kunyonyesha',
      'Postpartum Recovery': 'Kupona Baada ya Kujifungua',
    },
    quizDescriptions: {
      'Test your knowledge about proper nutrition during pregnancy': 'Jaribu ujuzi wako kuhusu lishe sahihi wakati wa ujauzito',
      'Learn about the important health considerations in your first trimester': 'Jifunze kuhusu mambo muhimu ya afya katika trimesta yako ya kwanza',
      'Discover safe ways to stay active during pregnancy': 'Gundua njia salama za kubaki hai wakati wa ujauzito',
      'Understanding the key aspects of prenatal care': 'Kuelewa mambo muhimu ya huduma ya kabla ya kuzaa',
      'Prepare yourself for labor and delivery': 'Jiandae kwa uchungu na kujifungua',
      'Essential knowledge for caring for your newborn': 'Ujuzi muhimu wa kutunza mtoto wako mchanga',
      'Learn the basics of successful breastfeeding': 'Jifunze misingi ya kunyonyesha kwa mafanikio',
      'Understanding your body\'s recovery after childbirth': 'Kuelewa kupona kwa mwili wako baada ya kujifungua',
    },
    questions: {
      'Which nutrient is essential for preventing neural tube defects?': 'Ni lishe gani muhimu kwa kuzuia kasoro za mirija ya neva?',
      'How many additional calories per day are recommended during the second trimester?': 'Kalori ngapi za ziada kwa siku zinapendekezwa wakati wa trimesta ya pili?',
      'Which food should be avoided during pregnancy?': 'Ni chakula gani kinapaswa kuepukwa wakati wa ujauzito?',
      'What is the recommended daily intake of water during pregnancy?': 'Kiwango cha maji kinachopendekezwa kwa siku wakati wa ujauzito ni kiasi gani?',
      'Which vitamin is important for iron absorption?': 'Ni vitamini gani muhimu kwa ufyonzaji wa chuma?',
    },
    options: {
      'Folic acid': 'Asidi ya foliki',
      'Vitamin C': 'Vitamini C',
      'Calcium': 'Kalsiamu',
      'Iron': 'Chuma',
      '100 calories': 'Kalori 100',
      '340 calories': 'Kalori 340',
      '500 calories': 'Kalori 500',
      '750 calories': 'Kalori 750',
      'Raw sushi': 'Sushi mbichi',
      'Cooked vegetables': 'Mboga zilizopikwa',
      'Whole grains': 'Nafaka nzima',
      'Lean meat': 'Nyama isiyo na mafuta',
      '4-6 glasses': 'Glasi 4-6',
      '8-12 glasses': 'Glasi 8-12',
      '2-3 glasses': 'Glasi 2-3',
      '15 glasses': 'Glasi 15',
      'Vitamin A': 'Vitamini A',
      'Vitamin B12': 'Vitamini B12',
      'Vitamin D': 'Vitamini D',
    },
  },
  zu: {
    quizTitles: {
      'Pregnancy Nutrition Basics': 'Izisekelo Zokudla Ngesikhathi Sokukhulelwa',
      'First Trimester Health': 'Impilo Ye-Trimester Yokuqala',
      'Safe Exercise During Pregnancy': 'Ukuzivocavoca Okuphephile Ngesikhathi Sokukhulelwa',
      'Prenatal Care Essentials': 'Izidingo Zokunakekelwa Ngaphambi Kokuzalwa',
      'Labor and Delivery Preparation': 'Ukulungiselela Ukubeletha Nokuzala',
      'Newborn Care Basics': 'Izisekelo Zokunakekela Ingane Esanda Kuzalwa',
      'Breastfeeding Fundamentals': 'Izisekelo Zokuncelisa',
      'Postpartum Recovery': 'Ukululama Ngemva Kokuzala',
    },
    quizDescriptions: {
      'Test your knowledge about proper nutrition during pregnancy': 'Hlola ulwazi lwakho mayelana nokudla okufanele ngesikhathi sokukhulelwa',
      'Learn about the important health considerations in your first trimester': 'Funda ngezinto ezibalulekile zempilo ku-trimester yakho yokuqala',
      'Discover safe ways to stay active during pregnancy': 'Thola izindlela eziphephile zokuhlala umatasa ngesikhathi sokukhulelwa',
      'Understanding the key aspects of prenatal care': 'Ukuqonda izinto ezibalulekile zokunakekelwa ngaphambi kokuzalwa',
      'Prepare yourself for labor and delivery': 'Zilungiselele ukubeletha nokuzala',
      'Essential knowledge for caring for your newborn': 'Ulwazi olubalulekile lokunakekela ingane yakho esanda kuzalwa',
      'Learn the basics of successful breastfeeding': 'Funda izisekelo zokuncelisa ngempumelelo',
      'Understanding your body\'s recovery after childbirth': 'Ukuqonda ukululama komzimba wakho ngemva kokuzala',
    },
    questions: {
      'Which nutrient is essential for preventing neural tube defects?': 'Yisiphi isondlo esibalulekile sokuvimbela ukukhubazeka kwe-neural tube?',
      'How many additional calories per day are recommended during the second trimester?': 'Mangaki amakhalori engeziwe ngosuku ancezelwe nge-trimester yesibili?',
      'Which food should be avoided during pregnancy?': 'Yikuphi ukudla okufanele kugwenywe ngesikhathi sokukhulelwa?',
      'What is the recommended daily intake of water during pregnancy?': 'Yini inani lamanzi elicezelwe nsuku zonke ngesikhathi sokukhulelwa?',
      'Which vitamin is important for iron absorption?': 'Iyiphi ivithamini ebalulekile ekumunceni insimbi?',
    },
    options: {
      'Folic acid': 'I-Folic acid',
      'Vitamin C': 'Ivithamini C',
      'Calcium': 'Ikhalsiamu',
      'Iron': 'Insimbi',
      '100 calories': 'Amakhalori angu-100',
      '340 calories': 'Amakhalori angu-340',
      '500 calories': 'Amakhalori angu-500',
      '750 calories': 'Amakhalori angu-750',
      'Raw sushi': 'I-sushi eluhlaza',
      'Cooked vegetables': 'Imifino ephekiwe',
      'Whole grains': 'Ukusanhlamvu okuphelele',
      'Lean meat': 'Inyama engenamafutha',
      '4-6 glasses': 'Izingilazi ezi-4-6',
      '8-12 glasses': 'Izingilazi ezi-8-12',
      '2-3 glasses': 'Izingilazi ezi-2-3',
      '15 glasses': 'Izingilazi ezingu-15',
      'Vitamin A': 'Ivithamini A',
      'Vitamin B12': 'Ivithamini B12',
      'Vitamin D': 'Ivithamini D',
    },
  },
};

// Helper to translate text with fallback
function translate(text, dict) {
  if (!text || !dict) return text;
  return dict[text] || dict[text.trim()] || text;
}

// Helper to translate quiz options (JSON array of strings)
function translateOptions(options, optionsDict) {
  if (!options || !optionsDict) return options;
  if (Array.isArray(options)) {
    return options.map(opt => optionsDict[opt] || opt);
  }
  return options;
}

// Helper to translate correct_answer (could be string or JSON)
function translateAnswer(answer, optionsDict) {
  if (!answer || !optionsDict) return answer;
  if (typeof answer === 'string') {
    return optionsDict[answer] || answer;
  }
  if (Array.isArray(answer)) {
    return answer.map(a => optionsDict[a] || a);
  }
  return answer;
}

async function seedTranslatedQuizzes() {
  // *** KEY FIX: Use the enum constant, not a raw string ***
  const targetLanguages = [
    { code: language_code.fr, key: 'fr' },
    { code: language_code.sw, key: 'sw' },
    { code: language_code.zu, key: 'zu' },
  ];

  // Fetch all English quizzes with their questions
  const englishQuizzes = await prisma.quiz.findMany({
    where: { language: language_code.en },
    include: {
      questions: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  console.log(`Found ${englishQuizzes.length} English quizzes to translate\n`);

  if (englishQuizzes.length === 0) {
    console.log('No English quizzes found. Seed English quizzes first.');
    return;
  }

  for (const { code: langEnum, key: langKey } of targetLanguages) {
    console.log(`--- Seeding ${langKey.toUpperCase()} quizzes ---`);
    const langData = translations[langKey];
    let created = 0;
    let skipped = 0;

    for (const quiz of englishQuizzes) {
      // Check if translated quiz already exists
      const existing = await prisma.quiz.findFirst({
        where: {
          category: quiz.category,
          language: langEnum,     // <-- enum, not string
          title: {
            contains: translate(quiz.title, langData.quizTitles).substring(0, 20),
          },
        },
      });

      if (existing) {
        console.log(`  SKIP: "${quiz.title}" already exists in ${langKey.toUpperCase()}`);
        skipped++;
        continue;
      }

      // Create translated quiz
      const translatedQuiz = await prisma.quiz.create({
        data: {
          title: translate(quiz.title, langData.quizTitles),
          description: translate(quiz.description, langData.quizDescriptions),
          category: quiz.category,
          difficulty: quiz.difficulty,
          country: quiz.country,
          language: langEnum,     // <-- enum, not string
          time_limit_mins: quiz.time_limit_mins,
          pass_threshold: quiz.pass_threshold,
          reward_amount: quiz.reward_amount,
          milestone_def_id: quiz.milestone_def_id,
          is_active: quiz.is_active,
        },
      });

      // Create translated questions
      for (const question of quiz.questions) {
        await prisma.quizQuestion.create({
          data: {
            quizId: translatedQuiz.id,
            questionText: translate(question.questionText, langData.questions),
            questionType: question.questionType,
            options: translateOptions(question.options, langData.options),
            correct_answer: translateAnswer(question.correct_answer, langData.options),
            explanation: question.explanation,
            sortOrder: question.sortOrder,
          },
        });
      }

      console.log(`  CREATED: "${translatedQuiz.title}" (${langKey.toUpperCase()})`);
      created++;
    }

    console.log(`${langKey.toUpperCase()} summary: ${created} created, ${skipped} skipped\n`);
  }
}

seedTranslatedQuizzes()
  .then(() => {
    console.log('Done!');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error('Seed error:', err);
    return prisma.$disconnect();
  });
