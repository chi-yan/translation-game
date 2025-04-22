/**
 * Local development server script
 * Addresses the ENOTSUP error on macOS when binding to 0.0.0.0
 */

// Use tsx to run the server with TypeScript support
require('tsx').run('./server/index-local.ts');