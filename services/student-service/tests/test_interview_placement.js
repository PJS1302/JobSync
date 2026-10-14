'use strict';

/**
 * Integration tests – Interview & Placement modules
 * Student Service (M1.6 / M1.7)
 *
 * Run from services/student-service:
 *   node tests/test_interview_placement.js
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../src/app');

// ── Helpers ──────────────────────────────────────────────────────────────────

let mongod;
let pass = 0;
let fail = 0;

function assert(label, condition, extra = '') {
  if (condition) {
    console.log(`  ✅  ${label}`);
    pass++;
  } else {
    console.error(`  ❌  ${label}${extra ? ' – ' + extra : ''}`);
    fail++;
  }
}

async function setup() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { dbName: 'test_interview_placement' });
}

async function teardown() {
  await mongoose.disconnect();
  await mongod.stop();
}

// ── Seed a student ────────────────────────────────────────────────────────────

let studentId;

async function seedStudent() {
  const res = await request(app)
    .post('/api/students')
    .send({
      name: 'Test Student',
      email: `interview_test_${Date.now()}@example.com`,
      phone: '9876543210',
      department: 'CSE',
      graduationYear: 2025,
      cgpa: 8.5,
    });
  assert('Seed student created (201)', res.status === 201);
  studentId = res.body.data?._id;
  assert('Seed student has _id', !!studentId);
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW TESTS
// ─────────────────────────────────────────────────────────────────────────────

async function testInterviews() {
  console.log('\n── Interview Module ──────────────────────────────────────────');

  const driveId = new mongoose.Types.ObjectId().toString();
  let interviewId;

  // ── CREATE ───────────────────────────────────────────────────────────────────

  console.log('\n  [POST /api/interviews]');

  {
    const res = await request(app)
      .post('/api/interviews')
      .send({
        studentId,
        driveId,
        roundName: 'Technical Round 1',
        date: '2025-06-15',
        time: '10:00',
        mode: 'ONLINE',
        locationOrLink: 'https://meet.google.com/abc',
      });
    assert('Create interview – 201', res.status === 201);
    assert('Create interview – has _id', !!res.body.data?._id);
    assert('Create interview – roundName correct', res.body.data?.roundName === 'Technical Round 1');
    assert('Create interview – status defaults to SCHEDULED', res.body.data?.status === 'SCHEDULED');
    interviewId = res.body.data?._id;
  }

  {
    const res = await request(app)
      .post('/api/interviews')
      .send({ studentId, driveId });
    assert('Create interview – missing fields → 400', res.status === 400);
  }

  {
    const res = await request(app)
      .post('/api/interviews')
      .send({ studentId: 'not-an-id', driveId, roundName: 'Round', date: '2025-06-15', time: '10:00' });
    assert('Create interview – invalid studentId → 400', res.status === 400);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/interviews')
      .send({ studentId: fakeId, driveId, roundName: 'Round', date: '2025-06-15', time: '10:00' });
    assert('Create interview – student not found → 404', res.status === 404);
  }

  {
    const res = await request(app)
      .post('/api/interviews')
      .send({ studentId, driveId, roundName: 'Round', date: '2025-06-15', time: '10:00', mode: 'TELEPATHY' });
    assert('Create interview – invalid mode → 400', res.status === 400);
  }

  // ── GET /student/:studentId ───────────────────────────────────────────────────

  console.log('\n  [GET /api/interviews/student/:studentId]');

  {
    const res = await request(app).get(`/api/interviews/student/${studentId}`);
    assert('Get interviews by student – 200', res.status === 200);
    assert('Get interviews by student – returns array', Array.isArray(res.body.data));
    assert('Get interviews by student – at least 1 record', res.body.data?.length >= 1);
  }

  {
    const res = await request(app).get('/api/interviews/student/bad-id');
    assert('Get interviews – invalid studentId → 400', res.status === 400);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/interviews/student/${fakeId}`);
    assert('Get interviews – unknown student → 404', res.status === 404);
  }

  // ── GET /:id ──────────────────────────────────────────────────────────────────

  console.log('\n  [GET /api/interviews/:id]');

  {
    const res = await request(app).get(`/api/interviews/${interviewId}`);
    assert('Get interview by id – 200', res.status === 200);
    assert('Get interview by id – correct id', res.body.data?._id === interviewId);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/interviews/${fakeId}`);
    assert('Get interview by id – not found → 404', res.status === 404);
  }

  {
    const res = await request(app).get('/api/interviews/bad-id');
    assert('Get interview by id – invalid id → 400', res.status === 400);
  }

  // ── extra: OFFLINE mode + applicationId ──────────────────────────────────────

  {
    const appId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/interviews')
      .send({
        studentId,
        applicationId: appId,
        driveId,
        roundName: 'HR Round',
        date: '2025-06-16',
        time: '14:00',
        mode: 'OFFLINE',
        locationOrLink: 'Block A, Room 101',
      });
    assert('Create interview OFFLINE with applicationId – 201', res.status === 201);
    assert('Create interview – mode stored correctly', res.body.data?.mode === 'OFFLINE');
    assert('Create interview – applicationId stored', !!res.body.data?.applicationId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACEMENT TESTS
// ─────────────────────────────────────────────────────────────────────────────

async function testPlacements() {
  console.log('\n── Placement Module ──────────────────────────────────────────');

  let placementId;

  // ── CREATE ───────────────────────────────────────────────────────────────────

  console.log('\n  [POST /api/placements]');

  {
    const res = await request(app)
      .post('/api/placements')
      .send({
        studentId,
        companyId: 'cmp-001',
        companyName: 'Acme Corp',
        role: 'Software Engineer',
        package: '12 LPA',
        placementYear: 2025,
        status: 'OFFERED',
      });
    assert('Create placement – 201', res.status === 201);
    assert('Create placement – has _id', !!res.body.data?._id);
    assert('Create placement – companyName correct', res.body.data?.companyName === 'Acme Corp');
    assert('Create placement – status is OFFERED', res.body.data?.status === 'OFFERED');
    placementId = res.body.data?._id;
  }

  {
    const res = await request(app)
      .post('/api/placements')
      .send({ studentId, companyName: 'Acme Corp' });
    assert('Create placement – missing role/package → 400', res.status === 400);
  }

  {
    const res = await request(app)
      .post('/api/placements')
      .send({ studentId: 'bad', companyName: 'X', role: 'Dev', package: '10 LPA' });
    assert('Create placement – invalid studentId → 400', res.status === 400);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/placements')
      .send({ studentId: fakeId, companyName: 'X', role: 'Dev', package: '10 LPA' });
    assert('Create placement – student not found → 404', res.status === 404);
  }

  {
    const res = await request(app)
      .post('/api/placements')
      .send({ studentId, companyName: 'X', role: 'Dev', package: '10 LPA', status: 'HIRED' });
    assert('Create placement – invalid status → 400', res.status === 400);
  }

  {
    const res = await request(app)
      .post('/api/placements')
      .send({ studentId, companyName: 'NumericCo', role: 'Backend Dev', package: 1200000, placementYear: 2025 });
    assert('Create placement – numeric package accepted – 201', res.status === 201);
    assert('Create placement – package stored as-is', res.body.data?.package === 1200000);
  }

  // ── GET /student/:studentId ───────────────────────────────────────────────────

  console.log('\n  [GET /api/placements/student/:studentId]');

  {
    const res = await request(app).get(`/api/placements/student/${studentId}`);
    assert('Get placements by student – 200', res.status === 200);
    assert('Get placements by student – returns array', Array.isArray(res.body.data));
    assert('Get placements by student – at least 2 records', res.body.data?.length >= 2);
  }

  {
    const res = await request(app).get('/api/placements/student/bad-id');
    assert('Get placements – invalid studentId → 400', res.status === 400);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/placements/student/${fakeId}`);
    assert('Get placements – unknown student → 404', res.status === 404);
  }

  // ── GET /:id ──────────────────────────────────────────────────────────────────

  console.log('\n  [GET /api/placements/:id]');

  {
    const res = await request(app).get(`/api/placements/${placementId}`);
    assert('Get placement by id – 200', res.status === 200);
    assert('Get placement by id – correct id', res.body.data?._id === placementId);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/placements/${fakeId}`);
    assert('Get placement by id – not found → 404', res.status === 404);
  }

  {
    const res = await request(app).get('/api/placements/bad-id');
    assert('Get placement by id – invalid id → 400', res.status === 400);
  }

  // ── ACCEPTED status ───────────────────────────────────────────────────────────

  {
    const res = await request(app)
      .post('/api/placements')
      .send({ studentId, companyName: 'GlobalTech', role: 'Full Stack Dev', package: '18 LPA', status: 'ACCEPTED' });
    assert('Create placement ACCEPTED status – 201', res.status === 201);
    assert('Create placement – status stored correctly', res.body.data?.status === 'ACCEPTED');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await setup();
    await seedStudent();
    await testInterviews();
    await testPlacements();
  } catch (err) {
    console.error('\nFatal error:', err);
    fail++;
  } finally {
    await teardown();
    const total = pass + fail;
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Results: ${pass} passed, ${fail} failed (${total} total)`);
    if (fail > 0) {
      console.log('STATUS: ❌ SOME TESTS FAILED');
      process.exit(1);
    } else {
      console.log('STATUS: ✅ ALL TESTS PASSED');
      process.exit(0);
    }
  }
})();
