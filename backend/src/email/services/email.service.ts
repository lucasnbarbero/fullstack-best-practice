import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private frontendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectPinoLogger(EmailService.name)
    private readonly logger: PinoLogger,
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@example.com';
  }

  async onModuleInit() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    // Si hay configuración SMTP, usarla (desarrollo o producción)
    if (smtpHost && smtpUser && smtpPass) {
      const smtpPort = this.configService.get<string>('SMTP_PORT');
      const port = smtpPort ? parseInt(smtpPort, 10) : 587;

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: port,
        secure: port === 465, // true para 465, false para otros puertos
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      this.logger.info(`📧 SMTP configurado: ${smtpHost}:${port}`);
    } else {
      // Sin configuración SMTP, usar Ethereal (solo para desarrollo/pruebas)
      await this.createEtherealTransporter();
    }
  }

  private async createEtherealTransporter() {
    try {
      // Crear cuenta de prueba en Ethereal
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      this.logger.info('📧 Ethereal email configurado para desarrollo');
      this.logger.info(`   Usuario: ${testAccount.user}`);
      this.logger.info(`   Ver emails en: https://ethereal.email`);
    } catch (error) {
      this.logger.error('Error al crear cuenta Ethereal', error);
      // Fallback: usar un transporter que solo logea
      this.transporter = {
        sendMail: async (options: any) => {
          this.logger.info('📧 [MOCK] Email enviado:', options);
          return { messageId: 'mock-message-id' };
        },
      } as any;
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Fullstack App" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      this.logger.info(`📧 Email enviado a: ${options.to}`);

      // En desarrollo, mostrar URL para ver el email
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.info(`   👁️ Ver email: ${previewUrl}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error al enviar email a ${options.to}`, error);
      throw error;
    }
  }

  // ========================
  // Emails de Autenticación
  // ========================

  async sendVerificationEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .link { color: #4F46E5; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verifica tu email</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${firstName}</strong>,</p>
            <p>¡Gracias por registrarte! Por favor verifica tu dirección de email haciendo clic en el siguiente botón:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar mi email</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p class="link">${verificationUrl}</p>
            <p>Este enlace expira en 24 horas.</p>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
          </div>
          <div class="footer">
            <p>© 2026 Fullstack Best Practices</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: '✉️ Verifica tu email - Fullstack App',
      html,
      text: `Hola ${firstName}, verifica tu email visitando: ${verificationUrl}`,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #DC2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .link { color: #DC2626; word-break: break-all; }
          .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 12px; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperar contraseña</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${firstName}</strong>,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer contraseña</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p class="link">${resetUrl}</p>
            <p>Este enlace expira en <strong>1 hora</strong>.</p>
            <div class="warning">
              <strong>⚠️ Importante:</strong> Si no solicitaste este cambio, ignora este email. Tu contraseña permanecerá sin cambios.
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Fullstack Best Practices</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: '🔐 Recuperar contraseña - Fullstack App',
      html,
      text: `Hola ${firstName}, restablece tu contraseña visitando: ${resetUrl}`,
    });
  }

  async sendPasswordChangedEmail(
    email: string,
    firstName: string,
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .warning { background: #FEF3C7; border: 1px solid #F59E0B; padding: 12px; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Contraseña actualizada</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${firstName}</strong>,</p>
            <p>Tu contraseña ha sido cambiada exitosamente.</p>
            <p>Si realizaste este cambio, no necesitas hacer nada más.</p>
            <div class="warning">
              <strong>⚠️ ¿No fuiste tú?</strong> Si no realizaste este cambio, tu cuenta podría estar comprometida. 
              Por favor contacta a soporte inmediatamente.
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Fullstack Best Practices</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: '✅ Tu contraseña ha sido actualizada',
      html,
      text: `Hola ${firstName}, tu contraseña ha sido cambiada exitosamente.`,
    });
  }
}
