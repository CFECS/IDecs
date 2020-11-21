import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { UserModel } from '../../model/rds/user.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { ReqSignupBodyDto } from '../../dto/user/req.signup.body.dto';
import { ReqLoginBodyDto } from '../../dto/user/req.login.body.dto';
import { ResLoginDto } from '../../dto/user/res.login.dto';
import { ResTokenValidateDto } from '../../dto/user/res.token.validate.dto';
import { RequestAo } from '../../middleware/request.ao';
import { ReqPaginationBaseDto } from '../../dto/req.pagination.base.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ReqPasswordChangeBodyDto } from '../../dto/user/req.password.change.body.dto';
import { ReqProfileUpdateBodyDto } from '../../dto/user/req.profile.update.body.dto';
import { ReqPasswordResetBodyDto } from '../../dto/user/req.password.reset.body.dto';
import { ReqEmailOrPhoneChangeBodyDto } from '../../dto/user/req.email.or.phone.change.body.dto';
import { PasswordUtil } from '../../util/password.util';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Body() signupBodyDto: ReqSignupBodyDto): Promise<void> {
    if (signupBodyDto.password !== signupBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
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
    return this.userService.getById(req.payload.profile.id);
  }

  @Get('/pagination')
  userPagination(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<UserModel>> {
    return this.userService.userPagination(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Put('/password/change')
  async passwordChange(@Req() req: RequestAo, @Body() passwordChangeBodyDto: ReqPasswordChangeBodyDto): Promise<void> {
    if (passwordChangeBodyDto.newPassword !== passwordChangeBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    const user = await this.userService.getById(req.payload.profile.id, true);
    if (!user) {
      throw new CustomException(ResponseCodeEnum.USER_NOT_EXIST);
    }
    if (!PasswordUtil.verifyPwd(passwordChangeBodyDto.oldPassword, user.password)) {
      throw new CustomException(ResponseCodeEnum.WRONG_PASSWORD);
    }
    await this.userService.passwordChange(req.payload.profile.id, passwordChangeBodyDto.newPassword);
  }

  @Put('/profile')
  async profileUpdate(@Req() req: RequestAo, @Body() profileUpdateBodyDto: ReqProfileUpdateBodyDto): Promise<void> {
    await this.userService.profileUpdate(req.payload.profile.id, profileUpdateBodyDto);
  }

  @Put('/password/reset/phone')
  async passwordResetByPhone(@Body() passwordResetBodyDto: ReqPasswordResetBodyDto): Promise<void> {
    if (passwordResetBodyDto.newPassword !== passwordResetBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    await this.userService.passwordResetByPhone(passwordResetBodyDto);
  }

  @Put('/password/reset/email')
  async passwordResetByEmail(@Body() passwordResetBodyDto: ReqPasswordResetBodyDto): Promise<void> {
    if (passwordResetBodyDto.newPassword !== passwordResetBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    await this.userService.passwordResetByEmail(passwordResetBodyDto);
  }

  @Put('/email/change')
  async emailChange(@Req() req: RequestAo, @Body() changeBodyDto: ReqEmailOrPhoneChangeBodyDto): Promise<void> {
    await this.userService.emailChange(req.payload.profile.id, changeBodyDto.email, changeBodyDto.code);
  }

  @Put('/phone/change')
  async phoneChange(@Req() req: RequestAo, @Body() changeBodyDto: ReqEmailOrPhoneChangeBodyDto): Promise<void> {
    await this.userService.phoneChange(req.payload.profile.id, changeBodyDto.phone, changeBodyDto.code);
  }

  @Get('/:id')
  getById(@Param('id') id: number): Promise<UserModel | undefined> {
    return this.userService.getById(id);
  }

  @Delete('/:id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.userService.removeById(id);
  }
}
