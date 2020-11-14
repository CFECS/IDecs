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
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupBodyDto: ReqSignupBodyDto): Promise<void> {
    if (signupBodyDto.password !== signupBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    await this.userService.signup(signupBodyDto);
  }

  @Post('login')
  login(@Body() loginBodyDto: ReqLoginBodyDto): Promise<ResLoginDto> {
    return this.userService.login(loginBodyDto);
  }

  @Get('ticket/validate')
  ticketValidate(@Query('ticket') ticket: string): Promise<ResTokenValidateDto> {
    return this.userService.validateTicket(ticket);
  }

  @Get()
  getSelf(@Req() req: RequestAo): Promise<UserModel | undefined> {
    return this.userService.getById(req.payload.profile?.id);
  }

  @Get('pagination')
  userPagination(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<UserModel>> {
    return this.userService.userPagination(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel | undefined> {
    return this.userService.getById(id);
  }

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.userService.removeById(id);
  }

  @Put('password/change')
  async passwordChange(@Req() req: RequestAo, @Body() passwordChangeBodyDto: ReqPasswordChangeBodyDto): Promise<void> {
    if (passwordChangeBodyDto.newPassword !== passwordChangeBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    await this.userService.passwordChange(
      req.payload.profile?.id,
      passwordChangeBodyDto.oldPassword,
      passwordChangeBodyDto.newPassword,
    );
  }

  @Put('profile')
  async profileUpdate(@Req() req: RequestAo, @Body() profileUpdateBodyDto: ReqProfileUpdateBodyDto): Promise<void> {
    await this.userService.profileUpdate(req.payload.profile?.id, profileUpdateBodyDto);
  }
}
