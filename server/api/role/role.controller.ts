import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReqAddOrUpdateBodyDto } from '../../dto/project/req.add.or.update.body.dto';
import { ReqPaginationBaseDto } from '../../dto/req.pagination.base.dto';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { RoleModel } from '../../model/rds/role.model';
import { RoleService } from './role.service';

@Controller('/api/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  add(@Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.roleService.add(bodyDto);
  }

  @Put('/:id')
  updateById(@Param('id') id: string, @Body() bodyDto: ReqAddOrUpdateBodyDto) {
    return this.roleService.updateById(id, bodyDto);
  }

  @Delete('/:id')
  removeById(@Param('id') id: string) {
    return this.roleService.removeById(id);
  }

  @Get()
  getAll(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<RoleModel>> {
    return this.roleService.getAll(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<RoleModel | undefined> {
    return this.roleService.getById(id);
  }
}
