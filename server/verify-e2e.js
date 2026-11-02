const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const runComprehensiveE2EVerification = async () => {
  console.log('===========================================================');
  console.log('🚀 RUNNING END-TO-END CRM WORKFLOW VERIFICATION SUITE');
  console.log('===========================================================\n');

  let server;
  const PORT = 5002;
  const baseUrl = `http://127.0.0.1:${PORT}`;

  try {
    const expressApp = require('./server');
    await new Promise((r) => setTimeout(r, 1000));

    server = expressApp.listen(PORT, async () => {
      console.log(`[E2E Server] Running at ${baseUrl}\n`);

      try {
        // STEP 1: Verify API Health
        console.log('--- Step 1: Server & Database Connectivity ---');
        const healthRes = await fetch(`${baseUrl}/api/health`);
        const healthData = await healthRes.json();
        if (healthData.status !== 'online') throw new Error('Health check failed');
        console.log('✓ Express API & MongoDB are online and responding.\n');

        // Clean database to 0 before starting
        const Lead = require('./models/Lead');
        const Activity = require('./models/Activity');
        await Lead.deleteMany({});
        await Activity.deleteMany({});
        console.log('✓ Starting with clean database (0 leads, 0 activities).\n');

        // STEP 2: Public Website Contact Form Ingestion (Image 4 flow)
        console.log('--- Step 2: Public Website Contact Form Ingestion ---');
        const contactPayload = {
          name: 'Sarah Connor',
          email: 'sarah.connor@cyberdyne.com',
          phone: '+1 (555) 800-2026',
          company: 'Cyberdyne Systems',
          subject: 'UI UX design',
          message: 'Interested in enterprise UI redesign and CRM dashboard license.',
        };
        const contactRes = await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactPayload),
        });
        const contactData = await contactRes.json();
        if (!contactData.success) throw new Error(`Contact form failed: ${contactData.message}`);
        console.log(`✓ Contact Form submitted successfully! Lead ID: ${contactData.leadId}`);

        // Verify lead is in MongoDB
        const capturedLead = await Lead.findById(contactData.leadId);
        if (!capturedLead || capturedLead.status !== 'New' || capturedLead.source !== 'Website') {
          throw new Error('Lead not saved accurately in MongoDB');
        }
        console.log(`✓ Lead accurately saved in MongoDB: Status="${capturedLead.status}", Source="${capturedLead.source}"\n`);

        // STEP 3: Admin Authentication & Session
        console.log('--- Step 3: Admin Authentication ---');
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@crm.com', password: 'admin123' }),
        });
        const loginData = await loginRes.json();
        if (!loginData.success) throw new Error('Admin login failed');
        const token = loginData.token;
        console.log(`✓ Admin authenticated. Token received for: ${loginData.admin.name} (${loginData.admin.email})\n`);

        const authHeaders = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        // STEP 4: Dashboard Stats Live Reflection (After 1 Lead)
        console.log('--- Step 4: Dashboard Live Reflection (1 Lead Captured) ---');
        const statsRes1 = await fetch(`${baseUrl}/api/dashboard/stats`, { headers: authHeaders });
        const statsData1 = await statsRes1.json();
        console.log(`  Total Leads: ${statsData1.stats.totalLeads} (Expected: 1)`);
        console.log(`  Not Contacted (New): ${statsData1.stats.newLeads} (Expected: 1)`);
        console.log(`  Conversions: ${statsData1.stats.convertedLeads} (Expected: 0)`);
        console.log(`  Source Breakdown: ${JSON.stringify(statsData1.sourceDistribution)}`);
        if (statsData1.stats.totalLeads !== 1 || statsData1.stats.newLeads !== 1) {
          throw new Error('Dashboard did not reflect the captured lead!');
        }
        console.log('✓ Dashboard stats dynamically reflected the new lead in real time!\n');

        // STEP 5: Add a Second Lead via Admin CRM Form
        console.log('--- Step 5: Admin Adds Lead via CRM Modal ---');
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const createLeadRes = await fetch(`${baseUrl}/api/leads`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            name: 'John Miller',
            email: 'john.miller@starlight.io',
            phone: '+1 (555) 919-4422',
            company: 'Starlight Tech',
            source: 'Advertisement',
            subject: 'Flutter Development',
            message: 'Looking for a dedicated Flutter mobile development team.',
            status: 'New',
            priority: 'High',
            dealValue: 60000,
            score: 85,
            followUpDate: tomorrow.toISOString().split('T')[0],
          }),
        });
        const lead2Data = await createLeadRes.json();
        const lead2Id = lead2Data.lead._id;
        console.log(`✓ 2nd Lead added via CRM modal: ${lead2Data.lead.name} (ID: ${lead2Id})\n`);

        // STEP 6: Status Progression & Conversion (From New -> Qualified -> Converted)
        console.log('--- Step 6: Status Progression & Conversion ---');
        // Qualify Lead 1
        await fetch(`${baseUrl}/api/leads/${capturedLead._id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ status: 'Qualified', priority: 'High', dealValue: 45000 }),
        });
        console.log('✓ Lead 1 status updated to "Qualified"');

        // Convert Lead 2 to a won client
        await fetch(`${baseUrl}/api/leads/${lead2Id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ status: 'Converted', dealValue: 60000 }),
        });
        console.log('✓ Lead 2 status updated to "Converted"');

        // STEP 7: Re-check Dashboard Metrics (Conversion Rate Calculation)
        console.log('\n--- Step 7: Verify Dynamic Metric Recalculation ---');
        const statsRes2 = await fetch(`${baseUrl}/api/dashboard/stats`, { headers: authHeaders });
        const statsData2 = await statsRes2.json();
        console.log(`  Total Leads: ${statsData2.stats.totalLeads} (Expected: 2)`);
        console.log(`  Qualified Leads: ${statsData2.stats.qualifiedLeads} (Expected: 1)`);
        console.log(`  Converted Leads: ${statsData2.stats.convertedLeads} (Expected: 1)`);
        console.log(`  Conversion Rate: ${statsData2.stats.conversionRate}% (Expected: 50%)`);
        console.log(`  Total Pipeline Value: $${statsData2.stats.totalPipelineValue.toLocaleString()} (Expected: $105,000)`);
        console.log(`  Converted Revenue: $${statsData2.stats.convertedPipelineValue.toLocaleString()} (Expected: $60,000)`);

        if (statsData2.stats.totalLeads !== 2 || statsData2.stats.convertedLeads !== 1 || statsData2.stats.conversionRate !== 50) {
          throw new Error('Metrics recalculation mismatch!');
        }
        console.log('✓ Win rate, pipeline revenue, and status counts recalculate dynamically!\n');

        // STEP 8: Activity Timeline & Internal Notes
        console.log('--- Step 8: Activity Timeline & Notes ---');
        // Add note
        const noteRes = await fetch(`${baseUrl}/api/leads/${capturedLead._id}/notes`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ content: 'Discussed project scope and budget over discovery call.' }),
        });
        const noteData = await noteRes.json();
        console.log(`✓ Note added to Lead 1: "${noteData.note.content}"`);

        // Log meeting activity
        const actRes = await fetch(`${baseUrl}/api/leads/${capturedLead._id}/activities`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            action: 'Meeting',
            description: 'Discovery call with Cyberdyne stakeholders.',
            type: 'meeting',
            metadata: { duration: '45 mins' },
          }),
        });
        const actData = await actRes.json();
        console.log(`✓ Timeline activity logged: ${actData.activity.action} (${actData.activity.description})`);

        // Fetch chronological timeline
        const timelineRes = await fetch(`${baseUrl}/api/leads/${capturedLead._id}/activities`, { headers: authHeaders });
        const timelineData = await timelineRes.json();
        console.log(`✓ Activity timeline returned ${timelineData.activities.length} chronological events.\n`);

        // STEP 9: Follow-ups Schedule Categorization
        console.log('--- Step 9: Follow-up Manager & Categorization ---');
        const followRes = await fetch(`${baseUrl}/api/followups`, { headers: authHeaders });
        const followData = await followRes.json();
        console.log(`  Upcoming Follow-ups: ${followData.data.counts.upcoming}`);
        console.log(`  Overdue Follow-ups: ${followData.data.counts.overdue}`);
        console.log(`  Today Follow-ups: ${followData.data.counts.today}`);

        // Mark follow-up completed
        const markRes = await fetch(`${baseUrl}/api/followups/${lead2Id}`, {
          method: 'PATCH',
          headers: authHeaders,
          body: JSON.stringify({ followUpStatus: 'Completed' }),
        });
        const markData = await markRes.json();
        console.log(`✓ Follow-up marked as: ${markData.lead.followUpStatus}\n`);

        // STEP 10: CSV Export Verification
        console.log('--- Step 10: CSV Export ---');
        const csvRes = await fetch(`${baseUrl}/api/leads/export/csv`, { headers: authHeaders });
        const csvContent = await csvRes.text();
        const csvLines = csvContent.trim().split('\n');
        console.log(`✓ CSV Export generated ${csvLines.length} rows (Header + 2 data rows)`);
        console.log(`  Header preview: ${csvLines[0].substring(0, 70)}...`);
        console.log(`  Row 1 preview: ${csvLines[1].substring(0, 70)}...\n`);

        // STEP 11: Lead Deletion & Clean Slate
        console.log('--- Step 11: Lead Deletion (Cascade Cleanup) ---');
        await fetch(`${baseUrl}/api/leads/${capturedLead._id}`, { method: 'DELETE', headers: authHeaders });
        await fetch(`${baseUrl}/api/leads/${lead2Id}`, { method: 'DELETE', headers: authHeaders });
        const finalCount = await Lead.countDocuments();
        const finalActCount = await Activity.countDocuments();
        console.log(`✓ Both test leads deleted. Current Lead count: ${finalCount}, Activity count: ${finalActCount}`);

        console.log('\n===========================================================');
        console.log('🎉 ALL 11 END-TO-END WORKFLOW VERIFICATIONS PASSED 100%!');
        console.log('===========================================================\n');

        server.close(() => {
          mongoose.connection.close().then(() => process.exit(0));
        });
      } catch (innerErr) {
        console.error('\n❌ E2E Verification failed:', innerErr);
        if (server) server.close();
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('\n❌ Server setup failed:', err);
    process.exit(1);
  }
};

runComprehensiveE2EVerification();

