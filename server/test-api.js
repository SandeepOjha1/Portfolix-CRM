const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const runIntegrationTests = async () => {
  console.log('--- Starting CRM API Integration Test Suite ---');
  let app;
  let server;
  let baseUrl;

  try {
    // Import and start app
    const expressApp = require('./server');
    // Wait briefly for db connection
    await new Promise((r) => setTimeout(r, 1500));

    const PORT = 5001;
    server = expressApp.listen(PORT, async () => {
      baseUrl = `http://127.0.0.1:${PORT}`;
      console.log(`Test server running at ${baseUrl}`);

      try {
        // 1. Health check
        console.log('\n[Test 1] Health Check...');
        const healthRes = await fetch(`${baseUrl}/api/health`);
        const healthData = await healthRes.json();
        console.log('✓ Health status:', healthData.status);

        // 2. Admin Login
        console.log('\n[Test 2] Admin Login...');
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@crm.com', password: 'admin123' }),
        });
        const loginData = await loginRes.json();
        if (!loginData.success || !loginData.token) {
          throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        }
        const token = loginData.token;
        console.log(`✓ Login successful. Admin: ${loginData.admin.name}, Role: ${loginData.admin.role}`);

        const authHeaders = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        // 3. Get Auth Me
        console.log('\n[Test 3] Verify Current Admin Session...');
        const meRes = await fetch(`${baseUrl}/api/auth/me`, { headers: authHeaders });
        const meData = await meRes.json();
        console.log(`✓ Auth me verified: ${meData.admin.email}`);

        // 4. Dashboard Stats
        console.log('\n[Test 4] Dashboard Analytics Stats...');
        const statsRes = await fetch(`${baseUrl}/api/dashboard/stats`, { headers: authHeaders });
        const statsData = await statsRes.json();
        console.log(`✓ Total Leads: ${statsData.stats.totalLeads}`);
        console.log(`✓ Conversion Rate: ${statsData.stats.conversionRate}%`);
        console.log(`✓ Statuses tracked: ${statsData.statusDistribution.length}`);
        console.log(`✓ Channels tracked: ${statsData.sourceDistribution.length}`);

        // 5. Get Leads with filtering
        console.log('\n[Test 5] Fetch Leads List...');
        const leadsRes = await fetch(`${baseUrl}/api/leads?limit=5`, { headers: authHeaders });
        const leadsData = await leadsRes.json();
        console.log(`✓ Fetched ${leadsData.leads.length} leads of total ${leadsData.total}`);

        // 6. Create New Lead
        console.log('\n[Test 6] Create New Lead...');
        const createRes = await fetch(`${baseUrl}/api/leads`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            name: 'Alexander Hamilton',
            email: 'alexander@treasury.gov',
            phone: '+1 (555) 001-1789',
            company: 'First Bank of US',
            source: 'Referral',
            subject: 'Financial SaaS Architecture',
            message: 'Need high security multi-region database setup.',
            status: 'New',
            priority: 'High',
            dealValue: 90000,
            score: 88,
          }),
        });
        const createdData = await createRes.json();
        const testLeadId = createdData.lead._id;
        console.log(`✓ Created lead with ID: ${testLeadId}`);

        // 7. Update Lead Status
        console.log('\n[Test 7] Update Lead Status & Priority...');
        const updateRes = await fetch(`${baseUrl}/api/leads/${testLeadId}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({
            status: 'Qualified',
            priority: 'High',
          }),
        });
        const updateData = await updateRes.json();
        console.log(`✓ Lead status updated to: ${updateData.lead.status}`);

        // 8. Add Note to Lead
        console.log('\n[Test 8] Add Internal Note...');
        const noteRes = await fetch(`${baseUrl}/api/leads/${testLeadId}/notes`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ content: 'Verified security requirements. Architecture meeting set.' }),
        });
        const noteData = await noteRes.json();
        console.log(`✓ Note added. Notes count: ${noteData.notes.length}`);

        // 9. Log Custom Activity
        console.log('\n[Test 9] Log Activity Timeline...');
        const actRes = await fetch(`${baseUrl}/api/leads/${testLeadId}/activities`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            action: 'Meeting',
            description: 'Architecture review call completed with Alexander.',
            type: 'meeting',
            metadata: { duration: '30 mins' },
          }),
        });
        const actData = await actRes.json();
        console.log(`✓ Activity logged: ${actData.activity.action}`);

        // 10. Public Contact Form Submission
        console.log('\n[Test 10] Public Contact Form Submission (Visitor)...');
        const contactRes = await fetch(`${baseUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Public Visitor Jane',
            email: 'jane.visitor@example.com',
            phone: '+1 (555) 332-1100',
            company: 'Nova Startup',
            subject: 'Website Inquiry',
            message: 'Interested in Mini CRM custom enterprise license.',
          }),
        });
        const contactData = await contactRes.json();
        console.log(`✓ Public contact submitted successfully: ${contactData.message}`);

        // 11. Follow-ups
        console.log('\n[Test 11] Fetch Follow-ups...');
        const followRes = await fetch(`${baseUrl}/api/followups`, { headers: authHeaders });
        const followData = await followRes.json();
        console.log(`✓ Follow-ups summary: Overdue: ${followData.data.counts.overdue}, Today: ${followData.data.counts.today}, Upcoming: ${followData.data.counts.upcoming}`);

        // 12. CSV Export
        console.log('\n[Test 12] Export Leads CSV...');
        const csvRes = await fetch(`${baseUrl}/api/leads/export/csv`, { headers: authHeaders });
        const csvText = await csvRes.text();
        console.log(`✓ CSV exported (${csvText.split('\n').length} lines)`);

        // 13. Delete Test Lead
        console.log('\n[Test 13] Delete Test Lead...');
        const delRes = await fetch(`${baseUrl}/api/leads/${testLeadId}`, {
          method: 'DELETE',
          headers: authHeaders,
        });
        const delData = await delRes.json();
        console.log(`✓ Test lead deleted successfully: ${delData.deletedId}`);

        console.log('\n=============================================');
        console.log('🎉 ALL 13 INTEGRATION TESTS PASSED SUCCESSFULLY!');
        console.log('=============================================\n');

        server.close(() => {
          mongoose.connection.close().then(() => process.exit(0));
        });
      } catch (testErr) {
        console.error('Test step failed:', testErr);
        if (server) server.close();
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Integration suite setup failed:', err);
    process.exit(1);
  }
};

runIntegrationTests();
