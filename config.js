'use strict';
exports.PORT = process.env.PORT || 8080;
exports.DATABASE_URL = process.env.DATABASE_URL || `mongodb://localhost/seed-database-router`;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || `mongodb://localhost/test-database-router`;
exports.JWT_SECRET = process.env.JWT_SECRET || `SUGARPLUMJEWEL`;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';