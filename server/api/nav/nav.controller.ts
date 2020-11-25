import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReqAddOrUpdateBodyDto } from '../../dto/nav/req.add.or.update.body.dto';
import { ReqPaginationBaseDto } from '../../dto/req.pagination.base.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { RoleModel } from '../../model/rds/role.model';
import { NavModel } from '../../model/rds/nav.model';
import { NavService } from './nav.service';

@Controller('/api/nav')
export class NavController {
  constructor(private readonly navService: NavService) {}

  @Post()
  add(@Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.navService.add(bodyDto);
  }

  @Put('/:id')
  updateById(@Param('id') id: number, @Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.navService.updateById(id, bodyDto);
  }

  @Delete('/:id')
  removeById(@Param('id') id: number) {
    return this.navService.removeById(id);
  }

  @Get()
  getAll(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<RoleModel>> {
    return this.navService.getAll(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get('/:id')
  getById(@Param('id') id: number): Promise<NavModel | undefined> {
    return this.navService.getById(id);
  }
}
