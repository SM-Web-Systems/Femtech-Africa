const { PrismaClient } = require('./generated/prisma-client');

const prisma = new PrismaClient();

async function main() {
  console.log('Testing database connection...\n');
  
  const users = await prisma.user.count();
  const partners = await prisma.partner.count();
  const pregnancies = await prisma.pregnancy.count();
  const milestones = await prisma.milestoneDefinition.count();
  const products = await prisma.partnerProduct.count();
  const userMilestones = await prisma.userMilestone.count();
  
  console.log('Database connected successfully!\n');
  console.log('Records found:');
  console.log('- Users:', users);
  console.log('- Partners:', partners);
  console.log('- Partner Products:', products);
  console.log('- Pregnancies:', pregnancies);
  console.log('- Milestone Definitions:', milestones);
  console.log('- User Milestones:', userMilestones);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
