const environment = require('../config/environment');

/**
 * Client interface for interacting with the external Placement Service.
 * Isolates inter-service HTTP communication without directly accessing
 * the Placement Service database.
 */
class PlacementServiceClient {
  constructor(baseUrl = environment.placementServiceUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch drive details by ID from Placement Service.
   * Gracefully returns null if the service is unreachable or not yet available.
   * @param {string} driveId
   * @returns {Promise<Object|null>}
   */
  async getDriveById(driveId) {
    if (!driveId) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/drives/${driveId}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.data || null;
    } catch {
      // Placement Service is offline or not implemented yet
      return null;
    }
  }
}

module.exports = new PlacementServiceClient();
