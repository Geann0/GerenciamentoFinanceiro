# Getting Started Guide

Welcome to the Advanced Finance Management System! This guide will help you set up and start using the application.

## Quick Start

### 1. Prerequisites

Make sure you have installed:

- Node.js 18 or higher ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- A code editor (VS Code recommended)

### 2. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd GERENCIADOR-DE-FINANÇAS

# Install dependencies
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

**Minimum Required:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set Up Database

```bash
# Run database migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## First Time Setup

### Create Your First User

1. Navigate to `http://localhost:3000`
2. Click "Get Started"
3. Fill in registration form:
   - Name
   - Email
   - Password (minimum 8 characters)
4. Click "Register"

### Sign In

1. Click "Sign In"
2. Enter your email and password
3. Or use "Sign in with Google"

## Using the Application

### Dashboard

The dashboard shows:

- **Balance Overview**: Total income, expenses, and balance
- **Monthly Trend**: Chart showing income/expense over time
- **Category Breakdown**: Pie chart of spending by category
- **Recent Transactions**: Latest 10 transactions

### Creating Transactions

#### Method 1: Quick Create from Dashboard

1. Click "+ New Transaction" button
2. Fill in the form:
   - **Type**: Income or Expense
   - **Amount**: Transaction amount
   - **Description**: What was this for?
   - **Date**: Transaction date
   - **Category**: Select from dropdown
3. Click "Create Transaction"

#### Method 2: Transactions Page

1. Navigate to "Transactions"
2. Click "Add Transaction"
3. Fill in details
4. (Optional) Add tags
5. (Optional) Upload receipt/attachment
6. Save

### Managing Categories

#### Create Category

1. Go to "Categories"
2. Click "New Category"
3. Fill in:
   - Name (e.g., "Food", "Salary")
   - Description (optional)
   - Color (for charts)
   - Icon (emoji)
   - Parent Category (for subcategories)
4. Save

#### Create Subcategory

1. Create parent category first (e.g., "Food")
2. Create new category
3. Select parent category
4. Save

Example structure:

```
📁 Food
  ├─ 🍕 Restaurants
  ├─ 🛒 Groceries
  └─ ☕ Coffee

💼 Income
  ├─ 💰 Salary
  ├─ 💵 Freelance
  └─ 🎁 Gifts
```

### Uploading Attachments

1. Create or edit a transaction
2. Click "Upload Attachment"
3. Select file (PDF, image, etc.)
4. Choose storage:
   - **AWS S3** (default)
   - **Google Drive** (requires Google sign-in)
5. Upload

### Viewing Reports

#### Generate Report

1. Navigate to "Reports"
2. Select filters:
   - Date range
   - Category
   - Transaction type
3. Click "Generate Report"

#### Export Report

- **CSV**: Click "Export CSV"
  - Opens in Excel/Google Sheets
  - Good for further analysis
- **PDF**: Click "Export PDF"
  - Formatted HTML document
  - Print-ready format

### Understanding Charts

#### Monthly Trend (Line Chart)

- Green line: Income
- Red line: Expenses
- Shows trends over time
- Helps identify patterns

#### Category Breakdown (Pie Chart)

- Each slice = category
- Size = amount spent
- Colors match category colors
- Click to see details

## Advanced Features

### Tags

Add tags to transactions for flexible organization:

```
Transaction: "Coffee at Starbucks"
Tags: coffee, morning, work
```

Search by tags later:

```
GET /api/transactions?tags=coffee,work
```

### Filters

Filter transactions by:

- Type (Income/Expense)
- Category
- Date range
- Amount range
- Tags

Example: "Show all food expenses over $50 in January"

### Email Notifications

You'll receive emails for:

- New account creation
- Large transactions
- Budget alerts (coming soon)

Configure in Settings > Notifications

## Troubleshooting

### Database Connection Error

**Problem**: "Can't connect to database"

**Solution**:

1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env`
3. Run: `npm run prisma:migrate`

### Authentication Error

**Problem**: "Unauthorized" errors

**Solution**:

1. Clear browser cookies
2. Sign out and sign in again
3. Check NEXTAUTH_SECRET is set

### Upload Fails

**Problem**: File upload doesn't work

**Solution**:

1. Check AWS credentials in `.env`
2. Verify S3 bucket exists
3. Check file size (max 10MB)

### Charts Not Showing

**Problem**: Empty charts on dashboard

**Solution**:

1. Add some transactions first
2. Refresh the page
3. Check browser console for errors

## Keyboard Shortcuts

- `Ctrl/Cmd + N`: New transaction
- `Ctrl/Cmd + F`: Search transactions
- `Ctrl/Cmd + R`: Generate report
- `Esc`: Close modal/form

## Mobile Usage

The application is responsive and works on:

- 📱 Phones (iOS/Android)
- 📱 Tablets
- 💻 Desktop

Tips for mobile:

- Use landscape for better chart view
- Swipe left on transactions to delete
- Pull down to refresh

## Best Practices

### 1. Regular Entry

- Add transactions daily
- Don't let them pile up
- Use mobile for on-the-go entries

### 2. Good Descriptions

❌ "Store"
✅ "Walmart - Weekly groceries"

### 3. Consistent Categories

- Use same categories
- Don't create duplicates
- Review and merge periodically

### 4. Tags Strategy

Use tags for:

- Projects: `#kitchen-remodel`
- Events: `#vacation2024`
- People: `#shared-with-john`

### 5. Attachments

Always attach receipts for:

- Business expenses
- Tax-deductible items
- Large purchases
- Warranty items

## Data Management

### Export Your Data

**All Transactions:**

```bash
GET /api/reports/export/csv?format=transactions
```

**By Category:**

```bash
GET /api/reports/export/csv?format=categories
```

### Backup Database

```bash
# Using Prisma Studio
npm run prisma:studio

# Export data
# Go to each table > Export
```

### Import Data

Contact support for bulk import assistance.

## Support & Help

### Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture](./docs/ARCHITECTURE.md)

### Get Help

- 📧 Email: support@financesystem.com
- 💬 Discord: [Join Server](#)
- 🐛 Issues: [GitHub Issues](#)

### Video Tutorials

- Getting Started (5 min)
- Transaction Management (10 min)
- Advanced Reporting (15 min)

## Next Steps

Now that you're set up:

1. ✅ Create your first transaction
2. ✅ Set up categories
3. ✅ Generate your first report
4. ✅ Invite team members (if multi-user)
5. ✅ Set up budget alerts
6. ✅ Export your first report

## Updates & Changelog

The system updates automatically. Check the [Changelog](./CHANGELOG.md) for new features.

**Latest Version**: 1.0.0
**Released**: January 2024

## Community

Join our community:

- Share tips and tricks
- Request features
- Help others
- Get expert advice

Welcome aboard! 🚀
