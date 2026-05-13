const { PrismaClient } = require('./generated/prisma-client');
const prisma = new PrismaClient();

async function seedPartners() {
  const partners = [
    {
      name: 'Shoprite',
      type: 'retail',
      country: 'ZA',
      description: 'Redeem for groceries and baby supplies at Shoprite stores',
      logoUrl: null,
      isActive: true,
    },
    {
      name: 'Uber',
      type: 'transport',
      country: 'ZA',
      description: 'Get Uber ride vouchers for clinic visits',
      logoUrl: null,
      isActive: true,
    },
    {
      name: 'Dis-Chem',
      type: 'healthcare',
      country: 'ZA',
      description: 'Pharmacy vouchers for prenatal vitamins and medicine',
      logoUrl: null,
      isActive: true,
    },
    {
      name: 'MTN Mobile Money',
      type: 'mobile_money',
      country: 'ZA',
      description: 'Convert tokens to MTN Mobile Money airtime or data',
      logoUrl: null,
      isActive: true,
    },
    {
      name: 'Checkers',
      type: 'retail',
      country: 'ZA',
      description: 'Grocery and baby product vouchers',
      logoUrl: null,
      isActive: true,
    },
  ];

  for (const partner of partners) {
    const existing = await prisma.partner.findFirst({
      where: { name: partner.name },
    });

    if (!existing) {
      await prisma.partner.create({ data: partner });
      console.log(`Created partner: ${partner.name}`);
    } else {
      console.log(`Partner exists: ${partner.name}`);
    }
  }

  // Add products for Shoprite
  const shoprite = await prisma.partner.findFirst({ where: { name: 'Shoprite' } });
  if (shoprite) {
    const products = [
      { name: 'R50 Grocery Voucher', description: 'Valid at any Shoprite', tokenCost: 500, category: 'nutrition_pack', partnerId: shoprite.id },
      { name: 'R100 Grocery Voucher', description: 'Valid at any Shoprite', tokenCost: 1000, category: 'nutrition_pack', partnerId: shoprite.id },
      { name: 'Baby Essentials Pack', description: 'Diapers, wipes, formula', tokenCost: 800, category: 'baby_supplies', partnerId: shoprite.id },
    ];

    for (const product of products) {
      const exists = await prisma.partnerProduct.findFirst({
        where: { name: product.name, partnerId: shoprite.id },
      });
      if (!exists) {
        await prisma.partnerProduct.create({ data: product });
        console.log(`Created product: ${product.name}`);
      }
    }
  }

  // Add products for Dis-Chem
  const dischem = await prisma.partner.findFirst({ where: { name: 'Dis-Chem' } });
  if (dischem) {
    const products = [
      { name: 'Prenatal Vitamins', description: '30-day supply', tokenCost: 300, category: 'pharmacy_voucher', partnerId: dischem.id },
      { name: 'R100 Pharmacy Credit', description: 'Any Dis-Chem store', tokenCost: 1000, category: 'pharmacy_voucher', partnerId: dischem.id },
    ];

    for (const product of products) {
      const exists = await prisma.partnerProduct.findFirst({
        where: { name: product.name, partnerId: dischem.id },
      });
      if (!exists) {
        await prisma.partnerProduct.create({ data: product });
        console.log(`Created product: ${product.name}`);
      }
    }
  }

  // Add products for Uber
  const uber = await prisma.partner.findFirst({ where: { name: 'Uber' } });
  if (uber) {
    const products = [
      { name: 'R50 Ride Voucher', description: 'Single trip to clinic', tokenCost: 500, category: 'transport_voucher', partnerId: uber.id },
      { name: 'R150 Ride Pack', description: '3 clinic trips', tokenCost: 1400, category: 'transport_voucher', partnerId: uber.id },
    ];

    for (const product of products) {
      const exists = await prisma.partnerProduct.findFirst({
        where: { name: product.name, partnerId: uber.id },
      });
      if (!exists) {
        await prisma.partnerProduct.create({ data: product });
        console.log(`Created product: ${product.name}`);
      }
    }
  }

  console.log('Done seeding partners and products!');
  await prisma.$disconnect();
}

seedPartners().catch(console.error);
