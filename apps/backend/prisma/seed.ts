import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@velora.com' },
    update: {},
    create: {
      email: 'admin@velora.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample agents
  const agents = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sarah.johnson@velora.com' },
      update: {},
      create: {
        email: 'sarah.johnson@velora.com',
        name: 'Sarah Johnson',
        password: await bcrypt.hash('agent123', 10),
        role: 'AGENT',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike.wilson@velora.com' },
      update: {},
      create: {
        email: 'mike.wilson@velora.com',
        name: 'Mike Wilson',
        password: await bcrypt.hash('agent123', 10),
        role: 'AGENT',
      },
    }),
  ]);

  console.log('✅ Sample agents created:', agents.length);

  // Create demo license
  const demoLicense = await prisma.license.upsert({
    where: { key: 'DEM-VELORA-DEMO01-TEST02-SAMPLE' },
    update: {},
    create: {
      key: 'DEM-VELORA-DEMO01-TEST02-SAMPLE',
      type: 'TRIAL',
      status: 'ACTIVE',
      maxAgents: 5,
      features: {
        pipeline_builder: true,
        ai_analysis: true,
        integrations: false,
        custom_branding: false,
      },
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  console.log('✅ Demo license created:', demoLicense.key);

  // Create sample calls
  const calls = await Promise.all([
    prisma.call.create({
      data: {
        caller: 'John Smith',
        number: '+1-555-0123',
        status: 'ACTIVE',
        priority: 'HIGH',
        department: 'Customer Service',
        duration: 154,
        agentId: agents[0].id,
        transcript: {
          messages: [
            'Customer: Hi, I need help with my order',
            'Agent: Hello! I\'d be happy to help you with that.',
          ],
        },
        sentiment: 'NEUTRAL',
      },
    }),
    prisma.call.create({
      data: {
        caller: 'Emily Davis',
        number: '+1-555-0456',
        status: 'QUEUED',
        priority: 'MEDIUM',
        department: 'Technical Support',
        duration: 0,
      },
    }),
    prisma.call.create({
      data: {
        caller: 'Michael Brown',
        number: '+1-555-0789',
        status: 'COMPLETED',
        priority: 'LOW',
        department: 'Sales',
        duration: 342,
        agentId: agents[1].id,
        sentiment: 'POSITIVE',
      },
    }),
  ]);

  console.log('✅ Sample calls created:', calls.length);

  // Create sample pipeline
  const pipeline = await prisma.pipeline.create({
    data: {
      name: 'Customer Support Automation',
      description: 'Automated call routing and sentiment analysis',
      status: 'ACTIVE',
      creatorId: admin.id,
      nodes: [
        {
          id: '1',
          type: 'trigger',
          position: { x: 250, y: 50 },
          data: {
            label: 'Call Received',
            triggerType: 'call_received',
          },
        },
        {
          id: '2',
          type: 'ai',
          position: { x: 450, y: 50 },
          data: {
            label: 'Sentiment Analysis',
            aiType: 'sentiment_analysis',
            config: {
              model: 'gpt-3.5-turbo',
            },
          },
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
        },
      ],
      executionCount: 1247,
    },
  });

  console.log('✅ Sample pipeline created:', pipeline.name);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });