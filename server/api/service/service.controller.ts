import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReqAddOrUpdateBodyDto } from '../../dto/service/req.add.or.update.body.dto';
import { ReqPaginationBaseDto } from '../../dto/req.pagination.base.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { ServiceModel } from '../../model/rds/service.model';
import { ServiceService } from './service.service';

@Controller('/api/service')
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Post()
  add(@Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.service.add(bodyDto);
  }

  @Put('/:id')
  updateById(@Param('id') id: number, @Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.service.updateById(id, bodyDto);
  }

  @Delete('/:id')
  removeById(@Param('id') id: number) {
    return this.service.removeById(id);
  }

  @Get()
  getAll(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<ServiceModel>> {
    return this.service.getAll(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get('/:id')
  getById(@Param('id') id: number): Promise<ServiceModel | undefined> {
    return this.service.getById(id);
  }
}
