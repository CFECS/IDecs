import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserModel } from '../../model/rds/user.model';
import { CustomException } from '../../exception/custom.exception';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { UserService } from './user.service';
import { SignupReqBodyDto } from './dto/signup.req.body.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupReqBodyDto: SignupReqBodyDto): Promise<void> {
    if (signupReqBodyDto.password !== signupReqBodyDto.confirmPassword) {
      throw new CustomException(ResponseCodeEnum.INCONSISTENT_PASSWORD);
    }
    await this.userService.signup(signupReqBodyDto);
  }

  @Post('login')
  login(): Promise<void> {
    return this.userService.login();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel | undefined> {
    return this.userService.getById(id);
  }

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.userService.removeById(id);
  }
}
