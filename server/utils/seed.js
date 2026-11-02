const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini_crm';
    await mongoose.connect(connUri);
    console.log(`[Seed] Connected to MongoDB at ${connUri}`);

    // Clear existing leads and activities, but PRESERVE all registered Admin accounts!
    await Lead.deleteMany({});
    await Activity.deleteMany({});
    console.log('[Seed] Cleared existing Lead and Activity collections (preserved Admin accounts)');

    // 1. Ensure Demo Admin exists without deleting user accounts
    let adminUser = await Admin.findOne({ email: 'admin@crm.com' });
    if (!adminUser) {
      adminUser = await Admin.create({
        name: 'Ryan Ellis',
        email: 'admin@crm.com',
        password: 'admin123',
        role: 'superadmin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      console.log(`[Seed] Demo Admin created: admin@crm.com / admin123`);
    } else {
      console.log(`[Seed] Demo Admin already exists: admin@crm.com`);
    }

    const now = new Date();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const daysAhead = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // 2. Realistic Leads dataset
    const sampleLeads = [
      {
        name: 'Jake Williams',
        email: 'jake.williams@acmecorp.com',
        phone: '+1 (555) 392-8192',
        company: 'Acme Corporation',
        source: 'Website',
        subject: 'Enterprise Cloud Migration & UI Redesign',
        message: 'Looking for a comprehensive overhaul of our customer self-service portal and migration to cloud infrastructure.',
        status: 'Qualified',
        priority: 'High',
        dealValue: 75000,
        score: 92,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAhead(1),
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(12),
        notes: [
          {
            content: 'Spoke with Jake. Strong interest in enterprise SLA and dedicated developer team.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(5),
          },
          {
            content: 'Sent technical proposal and security compliance docs.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(2),
          },
        ],
      },
      {
        name: 'Gretchen Herwitz',
        email: 'gretchen.h@northface.com',
        phone: '+1 (555) 748-2910',
        company: 'The North Face',
        source: 'Referral',
        subject: 'Mobile App Flutter Development',
        message: 'Need a cross-platform mobile shopping application with high performance and offline store locator.',
        status: 'Converted',
        priority: 'High',
        dealValue: 120000,
        score: 98,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAgo(1),
        followUpStatus: 'Completed',
        createdAt: daysAgo(45),
        notes: [
          {
            content: 'Contract signed! Development kickoff scheduled for next sprint.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(3),
          },
        ],
      },
      {
        name: 'Lincoln Donin',
        email: 'lincoln.donin@aa.com',
        phone: '+1 (555) 883-9921',
        company: 'American Airlines',
        source: 'Advertisement',
        subject: 'UI UX design',
        message: 'Seeking UI/UX design agency to craft passenger loyalty portal and interactive airport kiosk interface.',
        status: 'Contacted',
        priority: 'Medium',
        dealValue: 48000,
        score: 80,
        assignedTo: 'Ryan Ellis',
        followUpDate: new Date(), // Today
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(7),
        notes: [
          {
            content: 'First introductory call completed. Will send portfolio deck today.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(1),
          },
        ],
      },
      {
        name: 'Giana Levin',
        email: 'giana.levin@belleinc.io',
        phone: '+1 (555) 473-1928',
        company: 'Belle Inc',
        source: 'Social Media',
        subject: 'Digital marketing',
        message: 'Looking for omni-channel growth marketing and conversion rate optimization across our direct-to-consumer store.',
        status: 'New',
        priority: 'Medium',
        dealValue: 24000,
        score: 65,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAhead(2),
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(1),
        notes: [],
      },
      {
        name: 'Lydia Culhane',
        email: 'lydia.c@belleinc.io',
        phone: '+1 (555) 918-2736',
        company: 'Belle Inc',
        source: 'Website',
        subject: 'Python Fullstack',
        message: 'Custom analytics dashboard connected to our inventory and Shopify storefront.',
        status: 'Converted',
        priority: 'High',
        dealValue: 62000,
        score: 95,
        assignedTo: 'Ryan Ellis',
        followUpDate: null,
        followUpStatus: 'Completed',
        createdAt: daysAgo(25),
        notes: [
          {
            content: 'Payment processed and invoice issued. Milestone 1 underway.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(10),
          },
        ],
      },
      {
        name: 'Leo George',
        email: 'leo.george@northface.com',
        phone: '+1 (555) 203-9182',
        company: 'The North Face',
        source: 'Referral',
        subject: 'UI UX design',
        message: 'Interactive lookbook and 3D product visualizer for seasonal campaign.',
        status: 'Lost',
        priority: 'Low',
        dealValue: 15000,
        score: 40,
        assignedTo: 'Ryan Ellis',
        followUpDate: null,
        followUpStatus: 'None',
        createdAt: daysAgo(30),
        notes: [
          {
            content: 'Client decided to put project on hold due to budget reallocation.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(14),
          },
        ],
      },
      {
        name: 'Adison Lipshutz',
        email: 'adison.lipshutz@louisvuitton.com',
        phone: '+1 (555) 674-8839',
        company: 'Louis Vuitton',
        source: 'Advertisement',
        subject: 'Flutter Development',
        message: 'Internal inventory scanning app for boutique stores across Europe and North America.',
        status: 'Qualified',
        priority: 'High',
        dealValue: 95000,
        score: 90,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAhead(4),
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(15),
        notes: [
          {
            content: 'Technical security questionnaire approved by LV infoSec team.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(4),
          },
        ],
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@zenithcloud.tech',
        phone: '+1 (555) 902-3841',
        company: 'Zenith Cloud',
        source: 'Website',
        subject: 'UI UX design',
        message: 'Complete SaaS web application interface revamp with dark mode and component design system.',
        status: 'New',
        priority: 'High',
        dealValue: 35000,
        score: 85,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAgo(2), // Overdue follow-up!
        followUpStatus: 'Overdue',
        createdAt: daysAgo(4),
        notes: [],
      },
      {
        name: 'Michael Johnson',
        email: 'mjohnson@finedge.com',
        phone: '+1 (555) 431-7729',
        company: 'FinEdge Global',
        source: 'Other',
        subject: 'Python Fullstack',
        message: 'High-frequency reporting engine and automated accounting reconciliation tool.',
        status: 'Contacted',
        priority: 'Medium',
        dealValue: 55000,
        score: 78,
        assignedTo: 'Ryan Ellis',
        followUpDate: new Date(), // Today!
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(6),
        notes: [
          {
            content: 'Introductory discussion on data compliance and encryption requirements.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(2),
          },
        ],
      },
      {
        name: 'Elena Rostova',
        email: 'elena@quantumdynamics.org',
        phone: '+1 (555) 712-4490',
        company: 'Quantum Dynamics',
        source: 'Referral',
        subject: 'Digital marketing',
        message: 'Search engine optimization, content strategy, and B2B LinkedIn campaign management.',
        status: 'Qualified',
        priority: 'Medium',
        dealValue: 28000,
        score: 82,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAhead(3),
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(9),
        notes: [],
      },
      {
        name: 'Darrell Steward',
        email: 'darrell.s@vanguardlog.com',
        phone: '+1 (555) 881-2209',
        company: 'Vanguard Logistics',
        source: 'Website',
        subject: 'Flutter Development',
        message: 'Driver route optimization app with offline GPS and signature capture.',
        status: 'New',
        priority: 'Medium',
        dealValue: 42000,
        score: 72,
        assignedTo: 'Ryan Ellis',
        followUpDate: daysAhead(1),
        followUpStatus: 'Scheduled',
        createdAt: daysAgo(2),
        notes: [],
      },
      {
        name: 'Cody Fisher',
        email: 'cody@pulsehealth.ai',
        phone: '+1 (555) 662-1193',
        company: 'PulseHealth AI',
        source: 'Social Media',
        subject: 'UI UX design',
        message: 'Patient-facing mobile health tracking dashboard with medical chart visualizations.',
        status: 'Converted',
        priority: 'High',
        dealValue: 88000,
        score: 96,
        assignedTo: 'Ryan Ellis',
        followUpDate: null,
        followUpStatus: 'Completed',
        createdAt: daysAgo(20),
        notes: [
          {
            content: 'Sprint 2 deliverables approved by medical advisory board.',
            createdBy: 'Ryan Ellis',
            createdAt: daysAgo(8),
          },
        ],
      },
    ];

    const insertedLeads = await Lead.insertMany(sampleLeads);
    console.log(`[Seed] Successfully inserted ${insertedLeads.length} leads`);

    // 3. Populate Activity Timelines
    const acmeLead = insertedLeads.find((l) => l.company === 'Acme Corporation');
    if (acmeLead) {
      await Activity.insertMany([
        {
          leadId: acmeLead._id,
          action: 'Phone Call',
          description: 'Spoke with Jake about enterprise plan and multi-region deployment.',
          type: 'call',
          performedBy: 'Ryan Ellis',
          createdAt: daysAgo(5),
        },
        {
          leadId: acmeLead._id,
          action: 'Email Sent',
          description: 'Sent formal proposal and pricing details for 75k enterprise deal.',
          type: 'email',
          performedBy: 'Ryan Ellis',
          createdAt: daysAgo(3),
        },
        {
          leadId: acmeLead._id,
          action: 'Meeting',
          description: 'Discovery call with Acme team (Jake Williams, Sarah Chen + 2 others). Discussed pain points, goals, and next steps.',
          type: 'meeting',
          performedBy: 'Ryan Ellis',
          metadata: { duration: '45 mins', completed: true },
          createdAt: daysAgo(2),
        },
        {
          leadId: acmeLead._id,
          action: 'Follow-up Scheduled',
          description: 'Follow-up meeting scheduled for platform demo and Q&A session.',
          type: 'followup',
          performedBy: 'Ryan Ellis',
          createdAt: daysAgo(1),
        },
        {
          leadId: acmeLead._id,
          action: 'Status Updated',
          description: 'Status changed from "Contacted" to "Qualified"',
          type: 'system',
          performedBy: 'Ryan Ellis',
          createdAt: daysAgo(1),
        },
      ]);
    }

    // Populate activities for other sample leads
    for (const lead of insertedLeads) {
      if (lead._id.toString() !== acmeLead?._id.toString()) {
        await Activity.create({
          leadId: lead._id,
          action: 'Lead Created',
          description: `Lead created via ${lead.source} with initial status "${lead.status}"`,
          type: 'system',
          performedBy: lead.source === 'Website' ? 'Website Contact Form' : 'Ryan Ellis',
          createdAt: lead.createdAt,
        });

        if (lead.status !== 'New') {
          await Activity.create({
            leadId: lead._id,
            action: 'Status Updated',
            description: `Lead status updated to "${lead.status}"`,
            type: 'system',
            performedBy: 'Ryan Ellis',
            createdAt: daysAgo(Math.max(1, Math.floor(Math.random() * 5))),
          });
        }
      }
    }

    console.log('[Seed] Activities seeded successfully');
    console.log('\n=========================================');
    console.log('CRM Database initialized successfully!');
    console.log('Admin Credentials:');
    console.log('Email:    admin@crm.com');
    console.log('Password: admin123');
    console.log('=========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

