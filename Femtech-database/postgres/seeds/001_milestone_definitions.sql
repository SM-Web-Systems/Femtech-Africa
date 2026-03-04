-- momentum-database/postgres/seeds/001_milestone_definitions.sql
-- Description: Initial milestone definitions
-- Sprint: 4

-- ============================================================
-- CLINICAL MILESTONES
-- ============================================================

INSERT INTO milestone_definitions (code, name, description, category, country, reward_amount, max_claims_per_pregnancy, requires_verification, gestational_week_min, gestational_week_max, sort_order, icon) VALUES

-- ANC Visits
('ANC_VISIT_1', 'First Antenatal Visit', 'Complete your first antenatal care visit at a registered clinic.', 'clinical', NULL, 100, 1, TRUE, 1, 12, 10, 'hospital'),
('ANC_VISIT_2', 'Second Antenatal Visit', 'Complete your second antenatal care visit.', 'clinical', NULL, 75, 1, TRUE, 13, 20, 20, 'hospital'),
('ANC_VISIT_3', 'Third Antenatal Visit', 'Complete your third antenatal care visit.', 'clinical', NULL, 75, 1, TRUE, 21, 28, 30, 'hospital'),
('ANC_VISIT_4', 'Fourth Antenatal Visit', 'Complete your fourth antenatal care visit.', 'clinical', NULL, 75, 1, TRUE, 29, 34, 40, 'hospital'),
('ANC_VISIT_5', 'Fifth Antenatal Visit', 'Complete your fifth antenatal care visit.', 'clinical', NULL, 75, 1, TRUE, 35, 36, 50, 'hospital'),
('ANC_VISIT_6', 'Sixth Antenatal Visit', 'Complete your sixth antenatal care visit.', 'clinical', NULL, 75, 1, TRUE, 37, 38, 60, 'hospital'),
('ANC_VISIT_7', 'Seventh Antenatal Visit', 'Complete your seventh antenatal care visit.', 'clinical', NULL, 75, 1, TRUE, 39, 40, 70, 'hospital'),
('ANC_VISIT_8', 'Eighth Antenatal Visit', 'Complete your eighth antenatal care visit.', 'clinical', NULL, 100, 1, TRUE, 40, 42, 80, 'hospital'),

-- Lab Tests
('LAB_BLOOD_TYPE', 'Blood Type Test', 'Complete your blood type and Rh factor test.', 'clinical', NULL, 50, 1, TRUE, 1, 20, 100, 'lab'),
('LAB_HIV_TEST', 'HIV Screening', 'Complete your HIV screening test.', 'clinical', NULL, 50, 1, TRUE, 1, 20, 110, 'lab'),
('LAB_GLUCOSE', 'Glucose Tolerance Test', 'Complete your glucose tolerance test.', 'clinical', NULL, 50, 1, TRUE, 24, 28, 120, 'lab'),
('LAB_HEMOGLOBIN', 'Hemoglobin Test', 'Complete your hemoglobin level test.', 'clinical', NULL, 40, 2, TRUE, 1, 40, 130, 'lab'),

-- Ultrasounds
('ULTRASOUND_DATING', 'Dating Ultrasound', 'Complete your first dating ultrasound.', 'clinical', NULL, 75, 1, TRUE, 8, 14, 200, 'scan'),
('ULTRASOUND_ANOMALY', 'Anomaly Scan', 'Complete your 20-week anomaly scan.', 'clinical', NULL, 75, 1, TRUE, 18, 22, 210, 'scan'),
('ULTRASOUND_GROWTH', 'Growth Scan', 'Complete a growth scan in third trimester.', 'clinical', NULL, 50, 2, TRUE, 28, 40, 220, 'scan'),

-- ============================================================
-- WELLNESS MILESTONES
-- ============================================================

-- Check-in Streaks
('CHECKIN_3DAY', '3-Day Check-in Streak', 'Complete daily check-ins for 3 consecutive days.', 'wellness', NULL, 15, 10, FALSE, NULL, NULL, 300, 'streak'),
('CHECKIN_7DAY', '7-Day Check-in Streak', 'Complete daily check-ins for 7 consecutive days.', 'wellness', NULL, 30, 5, FALSE, NULL, NULL, 310, 'streak'),
('CHECKIN_14DAY', '14-Day Check-in Streak', 'Complete daily check-ins for 14 consecutive days.', 'wellness', NULL, 50, 3, FALSE, NULL, NULL, 320, 'streak'),
('CHECKIN_30DAY', '30-Day Check-in Streak', 'Complete daily check-ins for 30 consecutive days.', 'wellness', NULL, 100, 2, FALSE, NULL, NULL, 330, 'streak'),

-- Kick Counter
('KICK_COUNTER_FIRST', 'First Kick Count', 'Complete your first kick counting session.', 'wellness', NULL, 20, 1, FALSE, 24, 42, 400, 'baby'),
('KICK_COUNTER_10', 'Kick Counter Pro', 'Complete 10 kick counting sessions.', 'wellness', NULL, 50, 1, FALSE, 24, 42, 410, 'baby'),
('KICK_COUNTER_30', 'Kick Counter Expert', 'Complete 30 kick counting sessions.', 'wellness', NULL, 100, 1, FALSE, 24, 42, 420, 'baby'),

-- ============================================================
-- EDUCATION MILESTONES
-- ============================================================

-- Quizzes
('QUIZ_NUTRITION', 'Nutrition Quiz', 'Complete the pregnancy nutrition quiz with 70%+ score.', 'education', NULL, 25, 1, FALSE, NULL, NULL, 500, 'quiz'),
('QUIZ_DANGER_SIGNS', 'Danger Signs Quiz', 'Complete the danger signs quiz with 80%+ score.', 'education', NULL, 30, 1, FALSE, NULL, NULL, 510, 'quiz'),
('QUIZ_LABOR', 'Labor & Delivery Quiz', 'Complete the labor preparation quiz with 70%+ score.', 'education', NULL, 25, 1, FALSE, 28, 42, 520, 'quiz'),
('QUIZ_BREASTFEEDING', 'Breastfeeding Quiz', 'Complete the breastfeeding basics quiz with 70%+ score.', 'education', NULL, 25, 1, FALSE, 32, 42, 530, 'quiz'),
('QUIZ_NEWBORN', 'Newborn Care Quiz', 'Complete the newborn care quiz with 70%+ score.', 'education', NULL, 25, 1, FALSE, 36, 42, 540, 'quiz'),

-- Article Reading
('ARTICLES_5', 'Curious Reader', 'Read 5 educational articles.', 'education', NULL, 20, 1, FALSE, NULL, NULL, 600, 'book'),
('ARTICLES_15', 'Knowledge Seeker', 'Read 15 educational articles.', 'education', NULL, 40, 1, FALSE, NULL, NULL, 610, 'book'),
('ARTICLES_30', 'Expert Learner', 'Read 30 educational articles.', 'education', NULL, 75, 1, FALSE, NULL, NULL, 620, 'book'),

-- ============================================================
-- COMMUNITY MILESTONES
-- ============================================================

-- Posts
('POST_FIRST', 'First Share', 'Share your first journey post with the community.', 'community', NULL, 15, 1, FALSE, NULL, NULL, 700, 'share'),
('POST_5', 'Active Sharer', 'Share 5 journey posts with the community.', 'community', NULL, 30, 1, FALSE, NULL, NULL, 710, 'share'),

-- Support
('SUPPORT_FIRST', 'First Support', 'Support another mother with a helpful comment.', 'community', NULL, 10, 1, FALSE, NULL, NULL, 800, 'heart'),
('SUPPORT_10', 'Supportive Sister', 'Support 10 mothers with helpful comments.', 'community', NULL, 40, 1, FALSE, NULL, NULL, 810, 'heart'),
('SUPPORT_50', 'Community Champion', 'Support 50 mothers with helpful comments.', 'community', NULL, 100, 1, FALSE, NULL, NULL, 820, 'heart'),

-- Circle
('CIRCLE_CREATE', 'Build Your Circle', 'Create your support circle and invite at least one member.', 'community', NULL, 25, 1, FALSE, NULL, NULL, 900, 'users'),
('CIRCLE_COMPLETE', 'Circle Complete', 'Have 3 or more active members in your support circle.', 'community', NULL, 50, 1, FALSE, NULL, NULL, 910, 'users');

-- ============================================================
-- COUNTRY-SPECIFIC MILESTONES (South Africa)
-- ============================================================

INSERT INTO milestone_definitions (code, name, description, category, country, reward_amount, max_claims_per_pregnancy, requires_verification, gestational_week_min, gestational_week_max, sort_order, icon) VALUES

('ZA_MOMCONNECT', 'MomConnect Registration', 'Register with MomConnect for official health updates.', 'clinical', 'ZA', 30, 1, TRUE, NULL, NULL, 1000, 'phone'),
('ZA_ROAD_TO_HEALTH', 'Road to Health Booklet', 'Receive your Road to Health booklet.', 'clinical', 'ZA', 25, 1, TRUE, 1, 40, 1010, 'book');

-- ============================================================
-- COUNTRY-SPECIFIC MILESTONES (Uganda)
-- ============================================================

INSERT INTO milestone_definitions (code, name, description, category, country, reward_amount, max_claims_per_pregnancy, requires_verification, gestational_week_min, gestational_week_max, sort_order, icon) VALUES

('UG_FAMILYCONNECT', 'FamilyConnect Registration', 'Register with FamilyConnect for health updates.', 'clinical', 'UG', 30, 1, TRUE, NULL, NULL, 1100, 'phone'),
('UG_VHT_VISIT', 'VHT Home Visit', 'Receive a Village Health Team home visit.', 'clinical', 'UG', 40, 4, TRUE, NULL, NULL, 1110, 'home');
