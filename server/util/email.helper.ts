import { createTransport } from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { config } from '../../config';
import { CustomException } from '../exception/custom.exception';
import { ResponseCodeEnum } from '../../common/enum/response.code.enum';

@Injectable()
export class EmailHelper {
  private readonly transporter;

  constructor(private readonly logger: Logger) {
    this.transporter = createTransport(config.email.transport);
  }

  async sendEmail(code: string, email: string) {
    const params: Mail.Options = { to: email, from: config.email.info.from, subject: config.email.info.subject };
    params.html = config.email.info.html.replace(config.email.info.codeVarPlaceHolder, code);
    const response = await this.transporter.sendMail(params);
    this.logger.debug(response);
    if (response.rejected.length > 0) {
      throw new CustomException(ResponseCodeEnum.EMAIL_SENT_FAILED);
    }
  }
}
