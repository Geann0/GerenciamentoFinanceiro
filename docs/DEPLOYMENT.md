# Deployment Guide

This guide covers deploying the Finance Management System to production.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (for frontend)
- PostgreSQL database (Supabase, AWS RDS, or similar)
- AWS account (for S3)
- SendGrid account
- Stripe account (optional)

## Environment Variables

Create the following environment variables in your deployment platform:

### Required

```
DATABASE_URL=postgresql://user:password@host:5432/db
NEXTAUTH_SECRET=your-secret-key (generate with: openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
SENDGRID_API_KEY=your-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Optional

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Database Setup

### 1. Create PostgreSQL Database

Using Supabase:

```bash
# Create project at supabase.com
# Copy connection string
```

Using AWS RDS:

```bash
# Create PostgreSQL instance
# Note the endpoint and credentials
```

### 2. Run Migrations

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables
6. Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## AWS S3 Setup

### 1. Create S3 Bucket

```bash
aws s3 mb s3://your-finance-app-bucket
```

### 2. Configure CORS

Create `cors.json`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Apply CORS:

```bash
aws s3api put-bucket-cors --bucket your-bucket --cors-configuration file://cors.json
```

### 3. Create IAM User

Create user with permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket/*"
    }
  ]
}
```

## SendGrid Setup

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Verify sender email
3. Create API key with "Mail Send" permissions
4. Add API key to environment variables

### Configure Sender Email

```bash
# Add to environment
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## Stripe Setup (Optional)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook signing secret to environment variables

## Custom Domain

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### SSL/TLS

Vercel automatically provides SSL certificates via Let's Encrypt.

## CI/CD Setup

The project includes GitHub Actions workflow at `.github/workflows/ci-cd.yml`.

### Required Secrets

Add to GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Get Vercel Credentials

```bash
vercel login
vercel link

# Get org and project IDs from .vercel/project.json
```

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:

- Analytics
- Speed Insights
- Real-time logs

### Error Tracking

Integrate Sentry:

```bash
npm install @sentry/nextjs
```

Initialize Sentry:

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## Performance Optimization

### 1. Enable Caching

Add caching headers to API routes:

```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate");
  return response;
}
```

### 2. Database Connection Pooling

Use connection pooling for better performance:

```
DATABASE_URL=postgresql://user:password@host:5432/db?pgbouncer=true&connection_limit=10
```

### 3. Image Optimization

Use Next.js Image component:

```tsx
import Image from "next/image";

<Image src="/image.jpg" width={500} height={300} alt="..." />;
```

## Backup Strategy

### Database Backups

Automated daily backups with Supabase or AWS RDS.

Manual backup:

```bash
pg_dump $DATABASE_URL > backup.sql
```

Restore:

```bash
psql $DATABASE_URL < backup.sql
```

### File Backups

S3 versioning is enabled by default.

Enable S3 lifecycle policies for cost optimization.

## Scaling

### Database Scaling

- Increase connection pool size
- Add read replicas
- Implement caching with Redis

### Application Scaling

Vercel automatically scales based on traffic.

For custom scaling:

- Use serverless functions
- Implement Redis caching
- Use CDN for static assets

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting implemented
- [ ] CORS configured
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Security headers configured
- [ ] Dependency vulnerabilities checked

## Post-Deployment

1. Test all functionality
2. Monitor error logs
3. Set up alerts
4. Configure backups
5. Document deployment process
6. Train team on monitoring

## Rollback Procedure

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Or use Prisma migration
npx prisma migrate resolve --rolled-back <migration-name>
```

## Support

For deployment issues:

1. Check Vercel logs
2. Check database logs
3. Check application logs
4. Contact support@yourdomain.com
