import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL =
  process.env.SENDGRID_FROM_EMAIL || "noreply@financesystem.com";

export interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailParams): Promise<void> {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<void> {
  await sendEmail({
    to,
    subject: "Welcome to Finance Management System",
    text: `Hello ${name}, welcome to our Finance Management System!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #0ea5e9;">Welcome to Finance Management System</h1>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for joining our platform. We're excited to help you manage your finances effectively.</p>
        <p>Get started by adding your first transaction!</p>
        <br>
        <p>Best regards,<br>Finance Management Team</p>
      </div>
    `,
  });
}

export async function sendTransactionNotification(
  to: string,
  name: string,
  transactionType: string,
  amount: number
): Promise<void> {
  const color = transactionType === "INCOME" ? "#10b981" : "#ef4444";
  const type = transactionType === "INCOME" ? "Income" : "Expense";

  await sendEmail({
    to,
    subject: `New ${type} Recorded`,
    text: `Hello ${name}, a new ${type.toLowerCase()} of $${amount} has been recorded.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: ${color};">New ${type} Recorded</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>A new ${type.toLowerCase()} of <strong style="color: ${color};">$${amount.toFixed(
      2
    )}</strong> has been recorded in your account.</p>
        <p>Login to view more details.</p>
        <br>
        <p>Best regards,<br>Finance Management Team</p>
      </div>
    `,
  });
}

export async function sendBudgetAlert(
  to: string,
  name: string,
  budgetName: string,
  percentUsed: number
): Promise<void> {
  await sendEmail({
    to,
    subject: `Budget Alert: ${budgetName}`,
    text: `Hello ${name}, you've used ${percentUsed}% of your ${budgetName} budget.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #f59e0b;">Budget Alert</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You've used <strong style="color: #ef4444;">${percentUsed}%</strong> of your <strong>${budgetName}</strong> budget.</p>
        <p>Consider reviewing your expenses to stay within budget.</p>
        <br>
        <p>Best regards,<br>Finance Management Team</p>
      </div>
    `,
  });
}
