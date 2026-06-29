const router = require("express").Router();
const mongoose = require("mongoose");
const os = require("os");

// Captured once when this module is first loaded (i.e. server start)
const serverStartedAt = new Date();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Server health & status check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *       503:
 *         description: Server is unhealthy (e.g. DB disconnected)
 */
router.get("/", (req, res) => {
  const now = new Date();
  const uptimeMs = now - serverStartedAt;

  // Mongoose connection states: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbStateMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  const status = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: now.toISOString(),
    server: {
      startedAt: serverStartedAt.toISOString(),
      uptime: formatUptime(uptimeMs),
      uptimeSeconds: Math.floor(uptimeMs / 1000),
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
      platform: `${os.type()} ${os.release()}`,
      hostname: os.hostname(),
    },
    database: {
      status: dbStateMap[dbState] || "Unknown",
    },
    memory: {
      rss: formatBytes(process.memoryUsage().rss),
      heapUsed: formatBytes(process.memoryUsage().heapUsed),
      heapTotal: formatBytes(process.memoryUsage().heapTotal),
    },
  };

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 200 : 503,
    payload: status,
  });
});

/**
 * Convert milliseconds to a human-readable uptime string.
 * e.g. "2d 5h 32m 10s"
 */
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Convert bytes to a human-readable string.
 * e.g. "45.2 MB"
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

module.exports = router;
