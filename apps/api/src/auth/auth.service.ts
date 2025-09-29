import bcrypt from 'bcrypt'
import crypto from 'crypto'
import dotenv from 'dotenv'
import { Resend } from 'resend';
import { FastifyInstance } from 'fastify'
import { CreateUserInput, LoginInput, User, ForgotPasswordInput, ResetPasswordInput, PasswordResetToken } from './auth.types'
import { databaseService } from '../shared/database'

dotenv.config()

export class EmailService {
  private resend: Resend

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendEmail(email: string, subject: string, body: string): Promise<void> {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: subject,
      html: body
    })
    console.log('✅ Email sent successfully')
  }
}

export class AuthService {
  constructor(private fastify: FastifyInstance) { }

  // Helper method to hash passwords
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async createUser(input: CreateUserInput): Promise<Omit<User, 'password'>> {
    const isEmailAvailable = await databaseService.isEmailAvailable(input.email)

    if (!isEmailAvailable) {
      this.fastify.log.warn({ msg: `⚠️ User with email ${input.email} already exists` })
      throw new Error('User with this email already exists')
    }

    const existingUser = await databaseService.findUserByEmailIncludingDeleted(input.email)
    if (existingUser && existingUser.isDeleted) {
      this.fastify.log.info({ msg: `🔄 Restoring soft-deleted user with email ${input.email}` })
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)
    
    const user = await databaseService.createUser({
      email: input.email,
      name: input.name,
      password: hashedPassword,
      role: input.role,
    })

    this.fastify.log.info({ msg: `✅ User ${user.email} created successfully` })
    this.fastify.log.info({ msg: `🔍 User ID: ${user.id}` })

    await this.sendWelcomeEmail(user.email, user.name)

    return {
      ...user,
      deletedAt: user.deletedAt || undefined
    }
  }

  async login(input: LoginInput): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await databaseService.findUserByEmail(input.email)

    if (!user) {
      this.fastify.log.warn({ msg: `❌ Invalid email or password for email ${input.email}` })
      throw new Error('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password)
    if (!isValidPassword) {
      this.fastify.log.warn({ msg: `❌ Invalid password for email ${input.email}` })
      throw new Error('Invalid email or password')
    }

    // Set token expiration based on remember me preference
    const expiresIn = input.rememberMe ? '7d' : '24h' // 7 days if remember me, 24 hours if not
    
    this.fastify.log.info({ msg: `🔍 Creating JWT token for user: ${user.email} with ID: ${user.id}` })
    
    const token = this.fastify.jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      { expiresIn }
    )

    const { password, ...userWithoutPassword } = user
    return { 
      user: {
        ...userWithoutPassword,
        deletedAt: userWithoutPassword.deletedAt || undefined
      }, 
      token 
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    const user = await databaseService.findUserByEmail(input.email)

    if (!user) {
      // Don't reveal if user exists or not for security
      this.fastify.log.info({ msg: `📧 Password reset requested for email ${input.email}` })
      return
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    await databaseService.createPasswordResetToken({
      userId: user.id,
      token: resetToken,
      expiresAt,
    })

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    this.fastify.log.info({
      msg: `📧 Password reset email sent to ${input.email}`,
      resetUrl: resetUrl // Remove this in production
    })

    await this.sendPasswordResetEmail(user.email, resetUrl, user.name)
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    // Find the reset token
    const resetToken = await databaseService.findPasswordResetToken(input.token)

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired reset token')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(input.password, 10)

    // Update user password
    await databaseService.updateUser(resetToken.userId, { password: hashedPassword })

    // Mark token as used
    await databaseService.markPasswordResetTokenAsUsed(input.token)

    this.fastify.log.info({ msg: `✅ Password reset successful for user ${resetToken.user.email}` })
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await databaseService.findUserById(id)
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      isDeleted: user.isDeleted,
      deletedAt: user.deletedAt || undefined
    }
  }



  private async sendPasswordResetEmail(email: string, resetUrl: string, userName: string): Promise<void> {
    const emailService = new EmailService()
    const body = `
<!doctype html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Password Reset</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:32px 24px 16px 24px;">
                <h1 style="margin:0;font-size:22px;font-weight:bold;color:#111827;">
                  Reset your password
                </h1>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <p style="margin:0;font-size:16px;line-height:1.5;color:#374151;">
                  Hi ${userName},<br /><br />
                  We received a request to reset your password. Click the button below to choose a new password.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:0 24px 32px 24px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                          font-size:16px;font-weight:600;padding:14px 24px;border-radius:6px;">
                  Reset Password
                </a>
              </td>
            </tr>

            <!-- Fallback Link -->
            <tr>
              <td style="padding:0 24px 32px 24px;">
                <p style="margin:0;font-size:14px;line-height:1.5;color:#6b7280;">
                  If the button doesn't work, copy and paste this link into your browser:<br />
                  <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
    await emailService.sendEmail(email, 'Reset your password @Trench', body)
  }

  private async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const emailService = new EmailService()
    const body = `
<!doctype html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Welcome</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:32px 24px 16px 24px;">
                <h1 style="margin:0;font-size:24px;font-weight:bold;color:#111827;">
                  🎉 Welcome to Trench!
                </h1>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:0 24px 24px 24px;">
                <p style="margin:0;font-size:16px;line-height:1.5;color:#374151;">
                  Hi ${userName},<br /><br />
                  We're thrilled to have you on board! Your account has been created successfully.  
                  Explore all the features and make the most of Trench.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:0 24px 32px 24px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000/dashboard'}"
                   style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;
                          font-size:16px;font-weight:600;padding:14px 24px;border-radius:6px;">
                  Go to Dashboard
                </a>
              </td>
            </tr>

            <!-- Extra note -->
            <tr>
              <td style="padding:0 24px 32px 24px;">
                <p style="margin:0;font-size:14px;line-height:1.5;color:#6b7280;">
                  Need help getting started? Check out our <a href="{{helpUrl}}" style="color:#16a34a;">Getting Started Guide</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
    await emailService.sendEmail(email, 'Welcome to Trench!', body)
  }

}
