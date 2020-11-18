import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { UserModel } from '../../model/rds/user.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../../common/enum/response.code.enum';
import { ReqSignupBodyDto } from '../../../common/dto/user/req.signup.body.dto';
import { ReqLoginBodyDto } from '../../../common/dto/user/req.login.body.dto';
import { ResLoginDto } from '../../../common/dto/user/res.login.dto';
import { ResTokenValidateDto } from '../../../common/dto/user/res.token.validate.dto';
import { RequestAo } from '../../middleware/request.ao';
import { ReqPaginationBaseDto } from '../../../common/dto/req.pagination.base.dto';
import { ResPaginationDto } from '../../../common/dto/res.pagination.dto';
import { ReqPasswordChangeBodyDto } from '../../../common/dto/user/req.password.change.body.dto';
import { ReqProfileUpdateBodyDto } from '../../../common/dto/user/req.profile.update.body.dto';
import { NotificationService } from '../notification/notification.service';
import { NotifyTypeEnum } from '../../../common/enum/notify.type.enum';
import { ReqPasswordResetBodyDto } from '../../../common/dto/user/req.password.reset.body.dto';
import { ReqEmailOrPhoneChangeBodyDto } from '../../../common/dto/user/req.email.or.phone.change.body.dto';
import { PasswordUtil } from '../../util/password.util';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly notificationService: NotificationService) {}

  @Post('/signup')
  async signup(@Body() signupBodyDto: ReqSignupBodyDto): Promise<void> {
    if (signupBodyDto.password !== signupBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    if (signupBodyDto.email) {
      await this.notificationService.emailVerify(
        signupBodyDto.email,
        signupBodyDto.code,
        NotifyTypeEnum[NotifyTypeEnum.REGISTER],
      );
    } else if (signupBodyDto.phone) {
      await this.notificationService.smsVerify(
        signupBodyDto.phone,
        signupBodyDto.code,
        NotifyTypeEnum[NotifyTypeEnum.REGISTER],
      );
    } else {
      throw new CustomException(ResponseCodeEnum.EMAIL_OR_PHONE_NUMBER_NEEDED);
    }
    await this.userService.signup(signupBodyDto);
  }

  @Post('/login')
  login(@Body() loginBodyDto: ReqLoginBodyDto): Promise<ResLoginDto> {
    return this.userService.login(loginBodyDto);
  }

  @Get('/ticket/validate')
  ticketValidate(@Query('ticket') ticket: string): Promise<ResTokenValidateDto> {
    return this.userService.validateTicket(ticket);
  }

  @Get()
  getSelf(@Req() req: RequestAo): Promise<UserModel | undefined> {
    return this.userService.getById(req.payload.profile?.id);
  }

  @Get('/pagination')
  userPagination(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<UserModel>> {
    return this.userService.userPagination(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get('/:id')
  getById(@Param('id') id: number): Promise<UserModel | undefined> {
    return this.userService.getById(id);
  }

  @Delete('/:id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.userService.removeById(id);
  }

  @Put('/password/change')
  async passwordChange(@Req() req: RequestAo, @Body() passwordChangeBodyDto: ReqPasswordChangeBodyDto): Promise<void> {
    if (passwordChangeBodyDto.newPassword !== passwordChangeBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    const user = await this.userService.getById(req.payload.profile?.id);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    if (!PasswordUtil.verifyPwd(passwordChangeBodyDto.oldPassword, user.password)) {
      throw new CustomException(ResponseCodeEnum.WRONG_PASSWORD);
    }
    await this.userService.passwordChange(req.payload.profile?.id, passwordChangeBodyDto.newPassword);
  }

  @Put('/profile')
  async profileUpdate(@Req() req: RequestAo, @Body() profileUpdateBodyDto: ReqProfileUpdateBodyDto): Promise<void> {
    await this.userService.profileUpdate(req.payload.profile?.id, profileUpdateBodyDto);
  }

  @Put('/password/reset/phone')
  async passwordResetByPhone(@Body() passwordResetBodyDto: ReqPasswordResetBodyDto): Promise<void> {
    if (passwordResetBodyDto.newPassword !== passwordResetBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    const user = await this.userService.getByPhone(passwordResetBodyDto.phone);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    await this.notificationService.smsVerify(
      user.phone,
      passwordResetBodyDto.code,
      NotifyTypeEnum[NotifyTypeEnum.RESET_PASSWORD],
    );
    await this.userService.passwordChange(user.id, passwordResetBodyDto.newPassword);
  }

  @Put('/password/reset/email')
  async passwordResetByEmail(@Body() passwordResetBodyDto: ReqPasswordResetBodyDto): Promise<void> {
    if (passwordResetBodyDto.newPassword !== passwordResetBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    const user = await this.userService.getByEmail(passwordResetBodyDto.email);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    await this.notificationService.emailVerify(
      user.email,
      passwordResetBodyDto.code,
      NotifyTypeEnum[NotifyTypeEnum.RESET_PASSWORD],
    );
    await this.userService.passwordChange(user.id, passwordResetBodyDto.newPassword);
  }

  @Put('/email/change')
  async emailChange(
    @Req() req: RequestAo,
    @Body() emailOrPhoneChangeBodyDto: ReqEmailOrPhoneChangeBodyDto,
  ): Promise<void> {
    await this.notificationService.emailVerify(
      emailOrPhoneChangeBodyDto.email,
      emailOrPhoneChangeBodyDto.code,
      NotifyTypeEnum[NotifyTypeEnum.BINDING],
    );
    await this.userService.emailChange(req.payload.profile?.id, emailOrPhoneChangeBodyDto.email);
  }

  @Put('/phone/change')
  async phoneChange(
    @Req() req: RequestAo,
    @Body() emailOrPhoneChangeBodyDto: ReqEmailOrPhoneChangeBodyDto,
  ): Promise<void> {
    await this.notificationService.smsVerify(
      emailOrPhoneChangeBodyDto.phone,
      emailOrPhoneChangeBodyDto.code,
      NotifyTypeEnum[NotifyTypeEnum.BINDING],
    );
    await this.userService.phoneChange(req.payload.profile?.id, emailOrPhoneChangeBodyDto.phone);
  }
}
