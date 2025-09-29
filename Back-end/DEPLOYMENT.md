# Backend Deployment Guide

## Serverless Deployment Fixes Applied

### Issues Fixed:

1. **Removed WebSocket Server**: Serverless functions don't support WebSocket servers
2. **Converted to CommonJS**: Changed from ES modules to CommonJS for better serverless compatibility
3. **Removed Top-level Await**: Fixed seedCategories.ts to use async function instead
4. **Added Health Check**: Added `/health` endpoint for serverless monitoring
5. **Proper Export**: Export app as module.exports for serverless platforms

### Configuration Changes:

- **TypeScript**: Changed module system from ES2022 to CommonJS
- **Package.json**: Removed "type": "module" and updated main entry point
- **Index.ts**: Converted imports to require() statements
- **Export**: Changed from export default to module.exports

### Deployment Steps:

#### For Vercel:

1. Install Vercel CLI: `npm i -g vercel`
2. Build the project: `npm run build`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard:
   - `MONGODB_URL`: Your MongoDB connection string

#### For Netlify Functions:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

#### For AWS Lambda:

1. Build the project: `npm run build`
2. Package the `dist` folder with dependencies
3. Upload to AWS Lambda
4. Set environment variables in Lambda configuration

### Environment Variables Required:

- `MONGODB_URL`: MongoDB connection string
- `NODE_ENV`: Set to "production" for serverless deployment

### Health Check:

- Endpoint: `/health`
- Returns: `{ status: "OK", timestamp: "..." }`

### Local Development:

- Run: `npm start` (uses nodemon for development)
- The server will start on port 8000 or PORT environment variable
