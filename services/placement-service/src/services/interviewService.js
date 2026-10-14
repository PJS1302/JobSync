const mongoose = require('mongoose');
const InterviewRound = require('../models/InterviewRound');
const PlacementDrive = require('../models/PlacementDrive');
const studentServiceClient = require('../clients/studentServiceClient');

/**
 * Execute candidate selection workflow via Student Service REST APIs.
 * Final selection must be manual.
 *
 * When a candidate is selected:
 *   1. Update application status through Student Service REST API.
 *   2. Create/update placement record through Student Service REST API.
 *   3. Create selection notification through Student Service REST API.
 *
 * Does not access Student DB.
 *
 * @param {object} params
 * @param {string} params.driveId
 * @param {string} params.applicationId
 * @param {string} params.studentId
 * @param {string} params.decision - 'SHORTLISTED', 'SELECTED', or 'REJECTED'
 * @param {string} [params.remarks='']
 * @returns {Promise<object>} Selection execution summary
 */
const executeCandidateSelection = async ({
  driveId,
  applicationId,
  studentId,
  decision,
  remarks = '',
}) => {
  if (!applicationId) {
    const err = new Error('applicationId is required for candidate selection');
    err.statusCode = 400;
    throw err;
  }

  const validDecisions = ['SHORTLISTED', 'SELECTED', 'REJECTED'];
  if (!validDecisions.includes(decision)) {
    const err = new Error(`Decision must be one of: ${validDecisions.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  let drive = null;
  if (driveId && mongoose.Types.ObjectId.isValid(driveId)) {
    drive = await PlacementDrive.findById(driveId);
  }

  const results = {
    decision,
    applicationId,
    studentId,
    remarks,
    steps: {},
  };

  if (decision === 'SELECTED') {
    // 1. Update application status through Student Service REST API
    const appUpdate = await studentServiceClient.updateApplicationStatus(
      applicationId,
      'SELECTED',
      { remarks, driveId }
    );
    results.steps.applicationStatus = appUpdate;

    // 2. Create/update placement record through Student Service REST API
    const placementRecord = await studentServiceClient.createOrUpdatePlacement({
      studentId: studentId || applicationId,
      driveId,
      companyId: drive?.companyId,
      role: drive?.role || 'Selected Candidate',
      package: drive?.package || '',
      applicationId,
      status: 'PLACED',
      remarks,
      selectedAt: new Date(),
    });
    results.steps.placement = placementRecord;

    // 3. Create selection notification through Student Service REST API
    const notification = await studentServiceClient.createNotification({
      studentId: studentId || applicationId,
      title: 'Placement Selection Notification',
      message: `Congratulations! You have been selected for ${drive?.role || 'the role'}.`,
      type: 'SELECTION',
      driveId,
      applicationId,
    });
    results.steps.notification = notification;
  } else {
    // For SHORTLISTED or REJECTED
    const appUpdate = await studentServiceClient.updateApplicationStatus(
      applicationId,
      decision,
      { remarks, driveId }
    );
    results.steps.applicationStatus = appUpdate;

    if (studentId) {
      const notification = await studentServiceClient.createNotification({
        studentId,
        title: `Application Status: ${decision}`,
        message: `Your application status has been updated to ${decision}.`,
        type: decision,
        driveId,
        applicationId,
      });
      results.steps.notification = notification;
    }
  }

  return results;
};

/**
 * Create a new interview round.
 * @param {object} data
 * @returns {Promise<object>} Created interview round document
 */
const createInterviewRound = async (data) => {
  if (!mongoose.Types.ObjectId.isValid(data.driveId)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(data.driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }

  const interview = new InterviewRound(data);
  return await interview.save();
};

/**
 * Return all interview rounds for a specific placement drive.
 * @param {string} driveId
 * @param {object} [filter={}]
 * @returns {Promise<Array>}
 */
const getInterviewsByDrive = async (driveId, filter = {}) => {
  if (!mongoose.Types.ObjectId.isValid(driveId)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }

  const query = { driveId };
  if (filter.status) query.status = filter.status;
  if (filter.applicationId) query.applicationId = filter.applicationId;
  if (filter.roundName) query.roundName = filter.roundName;
  if (filter.decision) query.decision = filter.decision;

  return await InterviewRound.find(query).sort({ date: 1, createdAt: 1 });
};

/**
 * Update an existing interview round by ID.
 * If decision/candidateStatus is updated to SELECTED/SHORTLISTED/REJECTED,
 * performs the manual candidate selection REST workflow.
 *
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
const updateInterviewRound = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid interview ID format');
    err.statusCode = 400;
    throw err;
  }

  const existingInterview = await InterviewRound.findById(id);
  if (!existingInterview) {
    const err = new Error('Interview round not found');
    err.statusCode = 404;
    throw err;
  }

  const decision = data.decision || data.candidateStatus;
  let selectionResult = null;

  if (decision && ['SHORTLISTED', 'SELECTED', 'REJECTED'].includes(decision)) {
    selectionResult = await executeCandidateSelection({
      driveId: existingInterview.driveId,
      applicationId: existingInterview.applicationId,
      studentId: existingInterview.studentId || data.studentId,
      decision,
      remarks: data.remarks || existingInterview.remarks,
    });
    data.decision = decision;
  }

  const updatedInterview = await InterviewRound.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query',
  });

  return {
    interview: updatedInterview,
    selection: selectionResult,
  };
};

/**
 * Return a single interview round by ID.
 * @param {string} id
 * @returns {Promise<object>}
 */
const getInterviewById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid interview ID format');
    err.statusCode = 400;
    throw err;
  }

  const interview = await InterviewRound.findById(id);
  if (!interview) {
    const err = new Error('Interview round not found');
    err.statusCode = 404;
    throw err;
  }

  return interview;
};

module.exports = {
  createInterviewRound,
  getInterviewsByDrive,
  updateInterviewRound,
  getInterviewById,
  executeCandidateSelection,
};
