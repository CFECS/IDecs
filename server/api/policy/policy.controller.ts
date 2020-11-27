import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReqPaginationBaseDto } from '../../dto/req.pagination.base.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { PolicyModel } from '../../model/rds/policy.model';
import { ReqAddOrUpdateBodyDto } from '../../dto/policy/req.add.or.update.body.dto';
import { PolicyService } from './policy.service';

@Controller('/api/policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  add(@Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.policyService.add(bodyDto);
  }

  @Put('/:id')
  updateById(@Param('id') id: string, @Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.policyService.updateById(id, bodyDto);
  }

  @Delete('/:id')
  removeById(@Param('id') id: string) {
    return this.policyService.removeById(id);
  }

  @Get()
  getAll(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<PolicyModel>> {
    return this.policyService.getAll(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<PolicyModel | undefined> {
    return this.policyService.getById(id);
  }
}
