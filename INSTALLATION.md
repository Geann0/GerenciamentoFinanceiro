# 🚀 Advanced Finance Management System

## Installation & Setup Instructions

### Step 1: Install Dependencies

```powershell
npm install
```

### Step 2: Set Up Environment Variables

```powershell
# Copy the example file
Copy-Item .env.example .env

# Open .env in your editor and configure:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (run: openssl rand -base64 32)
# - NEXTAUTH_URL (http://localhost:3000)
# - AWS credentials (for file uploads)
# - SendGrid API key (for emails)
# - Stripe keys (optional, for payments)
# - Google OAuth (optional, for Google Drive)
```

### Step 3: Set Up PostgreSQL Database

**Option A: Local PostgreSQL**

```powershell
# Install PostgreSQL from https://www.postgresql.org/download/windows/
# Create a database
psql -U postgres
CREATE DATABASE finance_db;
\q

# Update .env with:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/finance_db"
```

**Option B: Supabase (Recommended for beginners)**

```powershell
# 1. Go to https://supabase.com
# 2. Create a new project
# 3. Copy the connection string
# 4. Update .env with the connection string
```

### Step 4: Run Database Migrations

```powershell
npm run prisma:migrate
npm run prisma:generate
```

### Step 5: Start Development Server

```powershell
npm run dev
```

### Step 6: Open Your Browser

Visit: http://localhost:3000

## ✅ Verify Installation

1. You should see the home page
2. Click "Get Started" to register
3. Create your first user account
4. You'll be redirected to the dashboard

## 🔧 Troubleshooting

### Database Connection Error

```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-15

# Test connection
psql -U postgres -d finance_db -c "SELECT 1;"
```

### Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
$env:PORT=3001; npm run dev
```

### Missing Dependencies

```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules, .next
npm install
```

## 📦 What's Included

✅ Next.js 14 with TypeScript
✅ Prisma ORM with PostgreSQL
✅ NextAuth.js authentication
✅ TailwindCSS styling
✅ React Query for state management
✅ Chart.js for visualizations
✅ AWS S3 integration
✅ SendGrid email service
✅ Stripe payment integration
✅ Google Drive API
✅ Jest & Cypress testing
✅ GitHub Actions CI/CD
✅ Complete documentation

## 🎯 Quick Start Commands

```powershell
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Database
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma Client

# Testing
npm test                 # Run unit tests
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## 📚 Documentation

- **README.md** - Project overview
- **docs/GETTING-STARTED.md** - Detailed user guide
- **docs/API.md** - API documentation
- **docs/DEPLOYMENT.md** - Deployment instructions
- **docs/ARCHITECTURE.md** - Technical architecture
- **PROJECT-SUMMARY.md** - Complete feature list

## 🆘 Need Help?

1. Check the documentation in the `docs/` folder
2. Review error messages in the console
3. Check the browser console for frontend errors
4. View logs in the terminal

## 🎊 You're All Set!

Your finance management system is ready to use. Start by:

1. Creating categories for your expenses
2. Adding your first transaction
3. Generating your first report
4. Exploring all the features

**Happy tracking!** 💰
