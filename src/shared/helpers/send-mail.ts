import { createTransport, Transporter } from 'nodemailer';
import logger from './logger';
import { mailOptions } from '../constants/types';

export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(mailOptions: mailOptions) {
    if (!mailOptions?.from) {
      const fromEmail = process.env.SMTP_FROM;
      Object.assign(mailOptions, { from: `noreply <${fromEmail}>` });
    }

    this.transporter.sendMail(mailOptions, (err: Error | null, _info: any) => {
      if (err) {
        logger.error(`${new Date().toLocaleString('es-CL')} ${err.message}`);
      } else {
        if (
          mailOptions.attachments !== undefined &&
          mailOptions.attachments.length > 0
        ) {
          mailOptions.attachments.forEach((element) => {
            switch (element.folder) {
              default:
                // Log a message for an unknown folder
                const logMessage = `Warning: Unable to determine the folder for file '${element.filename}' with path '${element.path}'. This file may not have been removed from the server.`;
                logger.error(
                  `${new Date().toLocaleString('es-CL')} ${logMessage}`,
                );
                break;
            }
          });
        }
      }
    });
  }
}
