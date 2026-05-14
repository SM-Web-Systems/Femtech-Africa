require('dotenv').config();
const { PrismaClient } = require('./generated/prisma-client');
const prisma = new PrismaClient();

// Translation maps for quiz content
const translations = {
  fr: {
    titles: {
      'Nutrition Basics': 'Bases de la Nutrition',
      'Mental Health During Pregnancy': 'Santé Mentale Pendant la Grossesse',
      'Prenatal Care Essentials': 'Soins Prénataux Essentiels',
      'Safe Exercise During Pregnancy': 'Exercice Sûr Pendant la Grossesse',
      'Breastfeeding Basics': 'Bases de l\'Allaitement',
      'Understanding Labor Signs': 'Comprendre les Signes du Travail',
      'Newborn Care': 'Soins du Nouveau-né',
      'Danger Signs in Pregnancy': 'Signes de Danger Pendant la Grossesse',
    },
    descriptions: {
      'Learn about essential nutrients': 'Apprenez les nutriments essentiels pour une grossesse saine',
      'Taking care of your emotional wellbeing': 'Prendre soin de votre bien-être émotionnel pendant la grossesse',
      'Understanding the importance of prenatal visits': 'Comprendre l\'importance des visites prénatales',
      'Stay active safely during pregnancy': 'Restez active en toute sécurité pendant la grossesse',
      'Prepare for breastfeeding your baby': 'Préparez-vous à allaiter votre bébé',
      'Know when labor is approaching': 'Savoir quand le travail approche',
      'Essential care for your newborn': 'Soins essentiels pour votre nouveau-né',
      'Recognize warning signs that need immediate attention': 'Reconnaître les signes d\'alerte nécessitant une attention immédiate',
    },
    questions: {
      'Which vitamin is essential for preventing neural tube defects?': 'Quelle vitamine est essentielle pour prévenir les anomalies du tube neural ?',
      'How many servings of fruits and vegetables should a pregnant woman eat daily?': 'Combien de portions de fruits et légumes une femme enceinte devrait-elle manger par jour ?',
      'Which mineral is important for blood production during pregnancy?': 'Quel minéral est important pour la production de sang pendant la grossesse ?',
      'What is a common sign of dehydration during pregnancy?': 'Quel est un signe courant de déshydratation pendant la grossesse ?',
      'Which food should be avoided during pregnancy?': 'Quel aliment doit être évité pendant la grossesse ?',
    },
    options: {
      'Folic acid': 'Acide folique',
      'Vitamin C': 'Vitamine C',
      'Vitamin D': 'Vitamine D',
      'Vitamin E': 'Vitamine E',
      'Iron': 'Fer',
      'Zinc': 'Zinc',
      'Copper': 'Cuivre',
      'Sodium': 'Sodium',
      'Dark urine': 'Urine foncée',
      'Frequent urination': 'Miction fréquente',
      'Increased appetite': 'Appétit accru',
      'Weight gain': 'Prise de poids',
      'Raw sushi': 'Sushi cru',
      'Cooked chicken': 'Poulet cuit',
      'Bananas': 'Bananes',
      'Brown rice': 'Riz complet',
      '2-3': '2-3',
      '5-9': '5-9',
      '10-12': '10-12',
      '1': '1',
    },
  },
  sw: {
    titles: {
      'Nutrition Basics': 'Misingi ya Lishe',
      'Mental Health During Pregnancy': 'Afya ya Akili Wakati wa Ujauzito',
      'Prenatal Care Essentials': 'Mambo Muhimu ya Huduma ya Ujauzito',
      'Safe Exercise During Pregnancy': 'Mazoezi Salama Wakati wa Ujauzito',
      'Breastfeeding Basics': 'Misingi ya Kunyonyesha',
      'Understanding Labor Signs': 'Kuelewa Ishara za Uchungu',
      'Newborn Care': 'Huduma ya Mtoto Mchanga',
      'Danger Signs in Pregnancy': 'Ishara za Hatari Wakati wa Ujauzito',
    },
    descriptions: {
      'Learn about essential nutrients': 'Jifunze kuhusu virutubisho muhimu kwa ujauzito wenye afya',
      'Taking care of your emotional wellbeing': 'Kutunza ustawi wako wa kihisia wakati wa ujauzito',
      'Understanding the importance of prenatal visits': 'Kuelewa umuhimu wa ziara za kabla ya kujifungua',
      'Stay active safely during pregnancy': 'Kaa hai kwa usalama wakati wa ujauzito',
      'Prepare for breastfeeding your baby': 'Jiandae kunyonyesha mtoto wako',
      'Know when labor is approaching': 'Jua wakati uchungu unakaribia',
      'Essential care for your newborn': 'Huduma muhimu kwa mtoto wako mchanga',
      'Recognize warning signs that need immediate attention': 'Tambua ishara za onyo zinazohitaji umakini wa haraka',
    },
    questions: {
      'Which vitamin is essential for preventing neural tube defects?': 'Ni vitamini gani muhimu kwa kuzuia kasoro za mirija ya neva?',
      'How many servings of fruits and vegetables should a pregnant woman eat daily?': 'Mama mjamzito anapaswa kula sehemu ngapi za matunda na mboga kwa siku?',
      'Which mineral is important for blood production during pregnancy?': 'Ni madini gani muhimu kwa uzalishaji wa damu wakati wa ujauzito?',
      'What is a common sign of dehydration during pregnancy?': 'Ni ishara gani ya kawaida ya upungufu wa maji wakati wa ujauzito?',
      'Which food should be avoided during pregnancy?': 'Ni chakula gani kinapaswa kuepukwa wakati wa ujauzito?',
    },
    options: {
      'Folic acid': 'Asidi ya foliki',
      'Vitamin C': 'Vitamini C',
      'Vitamin D': 'Vitamini D',
      'Vitamin E': 'Vitamini E',
      'Iron': 'Chuma',
      'Zinc': 'Zinki',
      'Copper': 'Shaba',
      'Sodium': 'Sodiamu',
      'Dark urine': 'Mkojo mweusi',
      'Frequent urination': 'Kukojoa mara kwa mara',
      'Increased appetite': 'Hamu ya kula iliyoongezeka',
      'Weight gain': 'Kupata uzito',
      'Raw sushi': 'Sushi mbichi',
      'Cooked chicken': 'Kuku aliyepikwa',
      'Bananas': 'Ndizi',
      'Brown rice': 'Mchele wa kahawia',
      '2-3': '2-3',
      '5-9': '5-9',
      '10-12': '10-12',
      '1': '1',
    },
  },
  zu: {
    titles: {
      'Nutrition Basics': 'Izisekelo Zokondla',
      'Mental Health During Pregnancy': 'Ezempilo Yengqondo Ngesikhathi Sokukhulelwa',
      'Prenatal Care Essentials': 'Okubalulekile Kokunakekelwa Kwangaphambi Kokubeletha',
      'Safe Exercise During Pregnancy': 'Ukuzivocavoca Okuphephile Ngesikhathi Sokukhulelwa',
      'Breastfeeding Basics': 'Izisekelo Zokuncelisa',
      'Understanding Labor Signs': 'Ukuqonda Izimpawu Zomshikashika',
      'Newborn Care': 'Ukunakekela Ingane Esanda Kuzalwa',
      'Danger Signs in Pregnancy': 'Izimpawu Zengozi Ngesikhathi Sokukhulelwa',
    },
    descriptions: {
      'Learn about essential nutrients': 'Funda ngezakha mzimba ezibalulekile ukuze ukhulelwe ngempilo',
      'Taking care of your emotional wellbeing': 'Ukunakekela inhlalakahle yakho yemizwa ngesikhathi sokukhulelwa',
      'Understanding the importance of prenatal visits': 'Ukuqonda ukubaluleka kokuvakashela kwangaphambi kokubeletha',
      'Stay active safely during pregnancy': 'Hlala usebenza ngokuphepha ngesikhathi sokukhulelwa',
      'Prepare for breastfeeding your baby': 'Zilungiselele ukuncelisa ingane yakho',
      'Know when labor is approaching': 'Yazi uma umshikashika usondela',
      'Essential care for your newborn': 'Ukunakekelwa okubalulekile kwengane yakho esanda kuzalwa',
      'Recognize warning signs that need immediate attention': 'Bona izimpawu zesixwayiso ezidinga ukunakwa ngokushesha',
    },
    questions: {
      'Which vitamin is essential for preventing neural tube defects?': 'Iyiphi ivithamini ebalulekile ukuvimbela amaphutha ethumbu yemithambo?',
      'How many servings of fruits and vegetables should a pregnant woman eat daily?': 'Owesifazane okhulelwe kufanele adle iziphi izingxenye zezithelo nemifino nsuku zonke?',
      'Which mineral is important for blood production during pregnancy?': 'Iyiphi iminerali ebalulekile ekukhiqizeni igazi ngesikhathi sokukhulelwa?',
      'What is a common sign of dehydration during pregnancy?': 'Iyiphi isibonakaliso esivamile sokushoda kwamanzi ngesikhathi sokukhulelwa?',
      'Which food should be avoided during pregnancy?': 'Yikuphi ukudla okufanele kugwenywe ngesikhathi sokukhulelwa?',
    },
    options: {
      'Folic acid': 'I-asidi ye-foliki',
      'Vitamin C': 'Ivithamini C',
      'Vitamin D': 'Ivithamini D',
      'Vitamin E': 'Ivithamini E',
      'Iron': 'Insimbi',
      'Zinc': 'I-zinki',
      'Copper': 'Ithusi',
      'Sodium': 'I-sodiamu',
      'Dark urine': 'Umchamo omnyama',
      'Frequent urination': 'Ukuchama kaningi',
      'Increased appetite': 'Isifiso sokudla esandile',
      'Weight gain': 'Ukukhuphuka kwesisindo',
      'Raw sushi': 'I-sushi eluhlaza',
      'Cooked chicken': 'Inkukhu ephekiwe',
      'Bananas': 'Ubhanana',
      'Brown rice': 'Ilayisi elintsundu',
      '2-3': '2-3',
      '5-9': '5-9',
      '10-12': '10-12',
      '1': '1',
    },
  },
};

function translateText(text, langMap) {
  return langMap[text] || text;
}

function translateOptions(options, langMap) {
  if (!Array.isArray(options)) return options;
  return options.map(opt => translateText(opt, langMap));
}

async function seedTranslatedQuizzes() {
  const targetLanguages = ['fr', 'sw', 'zu'];
  
  // Get all English quizzes with their questions
  const englishQuizzes = await prisma.quiz.findMany({
    where: { language: 'en' },
    include: { questions: { orderBy: { sortOrder: 'asc' } } },
  });

  console.log(`Found ${englishQuizzes.length} English quizzes to translate`);

  for (const lang of targetLanguages) {
    const t = translations[lang];
    console.log(`\n--- Seeding ${lang.toUpperCase()} quizzes ---`);

    for (const quiz of englishQuizzes) {
      // Check if this quiz already exists in this language
      const existing = await prisma.quiz.findFirst({
        where: {
          category: quiz.category,
          language: lang,
          title: { contains: translateText(quiz.title, t.titles).substring(0, 20) },
        },
      });

      if (existing) {
        console.log(`  SKIP: "${quiz.title}" already exists in ${lang}`);
        continue;
      }

      const translatedTitle = translateText(quiz.title, t.titles);
      const translatedDesc = quiz.description
        ? translateText(quiz.description, t.descriptions)
        : null;

      // Create the translated quiz
      const newQuiz = await prisma.quiz.create({
        data: {
          title: translatedTitle,
          description: translatedDesc,
          category: quiz.category,
          difficulty: quiz.difficulty,
          country: quiz.country,
          language: lang,
          time_limit_mins: quiz.time_limit_mins,
          pass_threshold: quiz.pass_threshold,
          reward_amount: quiz.reward_amount,
          milestone_def_id: quiz.milestone_def_id,
          is_active: true,
        },
      });

      // Create translated questions
      for (const q of quiz.questions) {
        const translatedQuestion = translateText(q.questionText, t.questions);
        const translatedOpts = translateOptions(q.options, t.options);

        await prisma.quizQuestion.create({
          data: {
            quizId: newQuiz.id,
            questionText: translatedQuestion,
            questionType: q.questionType,
            options: translatedOpts,
            correct_answer: q.correct_answer, // index stays the same
            explanation: q.explanation, // keep English for now
            sortOrder: q.sortOrder,
          },
        });
      }

      console.log(`  OK: "${translatedTitle}" (${lang}) - ${quiz.questions.length} questions`);
    }
  }

  // Summary
  for (const lang of ['en', ...targetLanguages]) {
    const count = await prisma.quiz.count({ where: { language: lang } });
    console.log(`\n${lang.toUpperCase()}: ${count} quizzes`);
  }

  await prisma.$disconnect();
  console.log('\nDone!');
}

seedTranslatedQuizzes().catch(err => {
  console.error('Seed error:', err);
  prisma.$disconnect();
  process.exit(1);
});
