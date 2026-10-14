const environment = require('../config/environment');

/**
 * REST Client for Placement Service Communication
 */
class PlacementServiceClient {
  constructor() {
    this.baseUrl = environment.placementServiceUrl;
  }

  /**
   * Fetch drive details from Placement Service
   * @param {string} driveId
   * @returns {Promise<object|null>}
   */
  async getDrive(driveId) {
    try {
      const response = await fetch(`${this.baseUrl}/drives/${driveId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const body = await response.json();
      return body.data || null;
    } catch (error) {
      console.warn(`[Student Service] Placement service fetch drive unreachable: ${error.message}`);
      return null;
    }
  }

  /**
   * Verify candidate eligibility with Placement Service
   * @param {string} driveId
   * @param {object} candidateData
   * @returns {Promise<{eligible: boolean, reason?: string}>}
   */
  async checkEligibility(driveId, candidateData) {
    try {
      const response = await fetch(`${this.baseUrl}/eligibility/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driveId,
          ...candidateData,
        }),
      });

      if (!response.ok) {
        return { eligible: true }; // Permissive fallback if placement service is offline
      }

      const body = await response.json();
      return body.data || { eligible: true };
    } catch (error) {
      console.warn(`[Student Service] Placement service eligibility check unreachable: ${error.message}`);
      return { eligible: true };
    }
  }
}

module.exports = new PlacementServiceClient();
