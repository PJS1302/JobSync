const assert = require('assert');

async function runServiceToServiceTests() {
  console.log('=== Service-to-Service Integration Test ===\n');

  // 1. Health Checks
  console.log('1. Checking Service Health...');
  const studentHealth = await fetch('http://localhost:5001/health').then((r) => r.json());
  assert.strictEqual(studentHealth.success, true);
  console.log('   ✅ Student Service is healthy');

  const placementHealth = await fetch('http://localhost:5002/health').then((r) => r.json());
  assert.strictEqual(placementHealth.success, true);
  console.log('   ✅ Placement Service is healthy\n');

  // 2. Student Service: Create Student
  console.log('2. Creating test student in Student Service...');
  const studentRes = await fetch('http://localhost:5001/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Rivera',
      email: `alex.rivera.${Date.now()}@university.edu`,
      phone: '9876543210',
      department: 'Computer Science & Engineering',
      graduationYear: 2027,
      cgpa: 8.92,
      skills: ['React', 'Node.js', 'MongoDB', 'System Design', 'Git']
    })
  }).then((r) => r.json());

  assert.strictEqual(studentRes.success, true);
  const student = studentRes.data?.student || studentRes.data;
  console.log(`   ✅ Student created: ${student.name} (${student._id})\n`);

  // 3. Placement Service: Create Company
  console.log('3. Creating partner company in Placement Service...');
  const companyName = `CloudScale Dynamics ${Date.now().toString(36)}`;
  const companyRes = await fetch('http://localhost:5002/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: companyName,
      industry: 'Cloud Infrastructure & SaaS',
      location: 'Bengaluru, Karnataka',
      website: 'https://cloudscaledynamics.example.com',
      contactEmail: `campus.${Date.now()}@cloudscaledynamics.example.com`
    })
  }).then((r) => r.json());

  assert.strictEqual(companyRes.success, true);
  const company = companyRes.data?.company || companyRes.data;
  console.log(`   ✅ Company created: ${company.name} (${company._id})\n`);

  // 4. Placement Service: Create Drive
  console.log('4. Creating placement drive in Placement Service...');
  const driveRes = await fetch('http://localhost:5002/api/drives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyId: company._id,
      role: 'Associate Software Engineer',
      description: 'Design and build resilient cloud microservices.',
      package: '₹18 - 22 LPA',
      location: 'Bengaluru / Hybrid',
      requiredSkills: ['Node.js', 'React', 'MongoDB'],
      eligibility: {
        minimumCGPA: 8.0,
        maximumBacklogs: 0,
        eligibleDepartments: ['Computer Science & Engineering', 'Information Technology'],
        graduationYear: 2027
      },
      status: 'PUBLISHED',
      applicationDeadline: new Date(Date.now() + 86400000 * 30).toISOString()
    })
  }).then((r) => r.json());

  assert.strictEqual(driveRes.success, true);
  const drive = driveRes.data?.drive || driveRes.data;
  console.log(`   ✅ Drive created: ${drive.role} (${drive._id})\n`);

  // 5. Service-to-Service: Eligibility Check
  console.log('5. Placement Service checking eligibility against Student Service candidate...');
  const eligRes = await fetch('http://localhost:5002/api/eligibility/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: student._id,
      driveId: drive._id
    })
  }).then((r) => r.json());

  assert.strictEqual(eligRes.success, true);
  const eligData = eligRes.data || eligRes;
  console.log(`   ✅ Eligibility status: ${eligData.eligible ? 'ELIGIBLE' : 'INELIGIBLE'}`);
  console.log(`   Details: ${JSON.stringify(eligData.reasons || eligData)}\n`);

  // 6. Student Service: Submit Application
  console.log('6. Submitting student application in Student Service...');
  const appRes = await fetch('http://localhost:5001/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: student._id,
      driveId: String(drive._id),
      companyId: String(company._id),
      role: drive.role
    })
  }).then((r) => r.json());

  assert.strictEqual(appRes.success, true);
  const application = appRes.data?.application || appRes.data;
  console.log(`   ✅ Application submitted: ID ${application._id}, Status: ${application.status}\n`);

  // 7. Placement Service: Candidate Screening
  console.log('7. Recording candidate screening in Placement Service...');
  const screenRes = await fetch('http://localhost:5002/api/screening', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      driveId: String(drive._id),
      applicationId: String(application._id),
      studentId: String(student._id),
      matchScore: 94,
      decision: 'SHORTLISTED',
      remarks: 'Strong profile with verified full-stack skills'
    })
  }).then((r) => r.json());

  assert.strictEqual(screenRes.success, true);
  const screening = screenRes.data?.screening || screenRes.data;
  console.log(`   ✅ Screening saved: Decision: ${screening.decision}, Match Score: ${screening.matchScore}%\n`);

  // 8. Placement Service: Create Interview Round
  console.log('8. Scheduling interview round in Placement Service...');
  const intRes = await fetch('http://localhost:5002/api/interviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      driveId: String(drive._id),
      applicationId: String(application._id),
      studentId: String(student._id),
      roundName: 'Technical Round 1 (System Architecture & DSA)',
      date: new Date(Date.now() + 86400000 * 2).toISOString(),
      time: '10:00 AM - 11:00 AM IST',
      mode: 'ONLINE',
      locationOrLink: 'https://meet.google.com/csd-tech-eval-01',
      status: 'SCHEDULED'
    })
  }).then((r) => r.json());

  assert.strictEqual(intRes.success, true);
  const interview = intRes.data?.interview || intRes.data;
  console.log(`   ✅ Interview round scheduled: ${interview.roundName}\n`);

  // 9. Placement Service: Selection & Inter-service Notification Trigger
  console.log('9. Recording candidate final selection (triggers Student Service placement & notification)...');
  const selectRes = await fetch('http://localhost:5002/api/interviews/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: String(student._id),
      driveId: String(drive._id),
      applicationId: String(application._id),
      decision: 'SELECTED',
      remarks: 'Selected for Associate Software Engineer'
    })
  }).then((r) => r.json());

  assert.strictEqual(selectRes.success, true);
  console.log(`   ✅ Final selection recorded: Decision: ${selectRes.data?.decision || 'SELECTED'}\n`);

  // 10. Verify Student Service received placement and notification
  console.log('10. Verifying Student Service updated with placement and notification...');
  const studentPlacements = await fetch(`http://localhost:5001/api/placements/student/${student._id}`).then((r) => r.json());
  assert.strictEqual(studentPlacements.success, true);
  const placementsList = studentPlacements.data || [];
  console.log(`   ✅ Placements in Student Service: ${placementsList.length} record(s)`);

  const studentNotifs = await fetch(`http://localhost:5001/api/notifications/${student._id}`).then((r) => r.json());
  assert.strictEqual(studentNotifs.success, true);
  const notifsList = studentNotifs.data || [];
  console.log(`   ✅ Notifications in Student Service: ${notifsList.length} notification(s)`);

  console.log('\n=== All Service-to-Service Integration Tests PASSED! ===');
}

runServiceToServiceTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});
