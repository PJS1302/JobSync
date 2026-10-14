'use strict';

/**
 * Integration tests – Notification module
 * Student Service
 *
 * Run from services/student-service:
 *   node tests/test_notifications.js
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
  await mongoose.connect(mongod.getUri(), { dbName: 'test_notifications' });
}

async function teardown() {
  await mongoose.disconnect();
  await mongod.stop();
}

// ── Seed a student ────────────────────────────────────────────────────────────

let studentId;
let student2Id;

async function seedStudents() {
  console.log('\n── Setup ─────────────────────────────────────────────────────');

  const r1 = await request(app)
    .post('/api/students')
    .send({
      name: 'Notif Student 1',
      email: `notif1_${Date.now()}@example.com`,
      phone: '9000000001',
      department: 'CSE',
      graduationYear: 2025,
      cgpa: 8.0,
    });
  assert('Seed student 1 (201)', r1.status === 201);
  studentId = r1.body.data?._id;
  assert('Student 1 has _id', !!studentId);

  const r2 = await request(app)
    .post('/api/students')
    .send({
      name: 'Notif Student 2',
      email: `notif2_${Date.now()}@example.com`,
      phone: '9000000002',
      department: 'ECE',
      graduationYear: 2025,
      cgpa: 7.5,
    });
  assert('Seed student 2 (201)', r2.status === 201);
  student2Id = r2.body.data?._id;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/notifications
// ─────────────────────────────────────────────────────────────────────────────

let notif1Id, notif2Id, notif3Id;

async function testCreate() {
  console.log('\n── POST /api/notifications ───────────────────────────────────');

  {
    // happy path – type NEW_DRIVE
    const res = await request(app).post('/api/notifications').send({
      studentId,
      title: 'New Drive Available',
      message: 'Google is hiring! Apply before 30 June.',
      type: 'NEW_DRIVE',
      relatedId: 'drive-123',
    });
    assert('Create notif NEW_DRIVE – 201', res.status === 201);
    assert('Create notif – has _id', !!res.body.data?._id);
    assert('Create notif – isRead defaults false', res.body.data?.isRead === false);
    assert('Create notif – type stored correctly', res.body.data?.type === 'NEW_DRIVE');
    assert('Create notif – relatedId stored', res.body.data?.relatedId === 'drive-123');
    notif1Id = res.body.data?._id;
  }

  {
    // type INTERVIEW_SCHEDULED
    const res = await request(app).post('/api/notifications').send({
      studentId,
      title: 'Interview Scheduled',
      message: 'Your technical round is on 20 June at 10 AM.',
      type: 'INTERVIEW_SCHEDULED',
    });
    assert('Create notif INTERVIEW_SCHEDULED – 201', res.status === 201);
    notif2Id = res.body.data?._id;
  }

  {
    // default type (SYSTEM) when omitted
    const res = await request(app).post('/api/notifications').send({
      studentId,
      title: 'System Maintenance',
      message: 'The portal will be down on Sunday.',
    });
    assert('Create notif – default type SYSTEM – 201', res.status === 201);
    assert('Create notif – type defaults to SYSTEM', res.body.data?.type === 'SYSTEM');
    notif3Id = res.body.data?._id;
  }

  {
    // notification for student 2 (isolation test)
    const res = await request(app).post('/api/notifications').send({
      studentId: student2Id,
      title: 'Shortlisted',
      message: 'You have been shortlisted for Microsoft.',
      type: 'SHORTLISTED',
    });
    assert('Create notif for student 2 – 201', res.status === 201);
  }

  // ── validation errors ────────────────────────────────────────────────────────

  {
    // missing title
    const res = await request(app).post('/api/notifications').send({
      studentId,
      message: 'No title provided',
    });
    assert('Create notif – missing title → 400', res.status === 400);
  }

  {
    // missing message
    const res = await request(app).post('/api/notifications').send({
      studentId,
      title: 'Title Only',
    });
    assert('Create notif – missing message → 400', res.status === 400);
  }

  {
    // invalid studentId
    const res = await request(app).post('/api/notifications').send({
      studentId: 'not-an-id',
      title: 'T',
      message: 'M',
    });
    assert('Create notif – invalid studentId → 400', res.status === 400);
  }

  {
    // student not found
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).post('/api/notifications').send({
      studentId: fakeId,
      title: 'T',
      message: 'M',
    });
    assert('Create notif – student not found → 404', res.status === 404);
  }

  {
    // invalid type
    const res = await request(app).post('/api/notifications').send({
      studentId,
      title: 'T',
      message: 'M',
      type: 'SMOKE_SIGNAL',
    });
    assert('Create notif – invalid type → 400', res.status === 400);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/notifications/:studentId
// ─────────────────────────────────────────────────────────────────────────────

async function testGetAll() {
  console.log('\n── GET /api/notifications/:studentId ─────────────────────────');

  {
    const res = await request(app).get(`/api/notifications/${studentId}`);
    assert('Get all – 200', res.status === 200);
    assert('Get all – has notifications array', Array.isArray(res.body.data?.notifications));
    assert('Get all – 3 notifications for student 1', res.body.data?.notifications.length === 3);
    assert('Get all – unreadCount is 3', res.body.data?.unreadCount === 3);
    // newest first
    const dates = res.body.data.notifications.map((n) => new Date(n.createdAt).getTime());
    assert('Get all – sorted newest first', dates[0] >= dates[1]);
  }

  {
    // student 2 isolation
    const res = await request(app).get(`/api/notifications/${student2Id}`);
    assert('Get all student 2 – 1 notification', res.body.data?.notifications.length === 1);
    assert('Get all student 2 – unreadCount 1', res.body.data?.unreadCount === 1);
  }

  {
    const res = await request(app).get('/api/notifications/bad-id');
    assert('Get all – invalid studentId → 400', res.status === 400);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/notifications/${fakeId}`);
    assert('Get all – unknown student → 404', res.status === 404);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/notifications/:studentId/unread
// ─────────────────────────────────────────────────────────────────────────────

async function testGetUnread() {
  console.log('\n── GET /api/notifications/:studentId/unread ──────────────────');

  {
    const res = await request(app).get(`/api/notifications/${studentId}/unread`);
    assert('Get unread – 200', res.status === 200);
    assert('Get unread – has notifications array', Array.isArray(res.body.data?.notifications));
    assert('Get unread – all 3 are unread', res.body.data?.notifications.length === 3);
    assert('Get unread – unreadCount matches array length', res.body.data?.unreadCount === 3);
    assert('Get unread – all isRead=false', res.body.data.notifications.every((n) => n.isRead === false));
  }

  {
    const res = await request(app).get('/api/notifications/bad-id/unread');
    assert('Get unread – invalid studentId → 400', res.status === 400);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/notifications/:id/read
// ─────────────────────────────────────────────────────────────────────────────

async function testMarkOneRead() {
  console.log('\n── PUT /api/notifications/:id/read ───────────────────────────');

  {
    const res = await request(app).put(`/api/notifications/${notif1Id}/read`);
    assert('Mark one read – 200', res.status === 200);
    assert('Mark one read – isRead is true', res.body.data?.isRead === true);
    assert('Mark one read – correct id returned', res.body.data?._id === notif1Id);
  }

  {
    // unread count must now be 2 for student 1
    const res = await request(app).get(`/api/notifications/${studentId}`);
    assert('After mark-one-read – unreadCount is 2', res.body.data?.unreadCount === 2);
  }

  {
    // marking the same notification again is idempotent
    const res = await request(app).put(`/api/notifications/${notif1Id}/read`);
    assert('Mark already-read – still 200', res.status === 200);
    assert('Mark already-read – isRead still true', res.body.data?.isRead === true);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/notifications/${fakeId}/read`);
    assert('Mark one read – not found → 404', res.status === 404);
  }

  {
    const res = await request(app).put('/api/notifications/bad-id/read');
    assert('Mark one read – invalid id → 400', res.status === 400);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/notifications/:studentId/read-all
// ─────────────────────────────────────────────────────────────────────────────

async function testMarkAllRead() {
  console.log('\n── PUT /api/notifications/:studentId/read-all ────────────────');

  {
    const res = await request(app).put(`/api/notifications/${studentId}/read-all`);
    assert('Mark all read – 200', res.status === 200);
    // 2 notifications were still unread
    assert('Mark all read – modifiedCount is 2', res.body.data?.modifiedCount === 2);
  }

  {
    // unread count must now be 0
    const all = await request(app).get(`/api/notifications/${studentId}`);
    assert('After mark-all-read – unreadCount is 0', all.body.data?.unreadCount === 0);

    const unread = await request(app).get(`/api/notifications/${studentId}/unread`);
    assert('After mark-all-read – unread array empty', unread.body.data?.notifications.length === 0);
    assert('After mark-all-read – unreadCount is 0', unread.body.data?.unreadCount === 0);
  }

  {
    // calling again (nothing left to update)
    const res = await request(app).put(`/api/notifications/${studentId}/read-all`);
    assert('Mark all read again – 200 (idempotent)', res.status === 200);
    assert('Mark all read again – modifiedCount is 0', res.body.data?.modifiedCount === 0);
  }

  {
    // student 2 unaffected
    const res = await request(app).get(`/api/notifications/${student2Id}`);
    assert('Student 2 unreadCount still 1 after student 1 mark-all', res.body.data?.unreadCount === 1);
  }

  {
    const res = await request(app).put('/api/notifications/bad-id/read-all');
    assert('Mark all read – invalid studentId → 400', res.status === 400);
  }

  {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).put(`/api/notifications/${fakeId}/read-all`);
    assert('Mark all read – unknown student → 404', res.status === 404);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await setup();
    await seedStudents();
    await testCreate();
    await testGetAll();
    await testGetUnread();
    await testMarkOneRead();
    await testMarkAllRead();
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
