import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ReqAddOrUpdateBodyDto } from '../../dto/project/req.add.or.update.body.dto';
import { ProjectModel } from '../../model/rds/project.model';
import { ResPaginationDto } from '../../dto/res.pagination.dto';
import { RequestAo } from '../../middleware/request.ao';
import { ReqPaginationBaseDto } from '../../dto/req.pagination.base.dto';
import { ProjectService } from './project.service';

@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  add(@Body() bodyDto: ReqAddOrUpdateBodyDto, @Req() req: RequestAo) {
    return this.projectService.add(bodyDto, req.payload.profile.id);
  }

  @Put('/:id')
  updateById(@Param('id') id: number, @Body() bodyDto: ReqAddOrUpdateBodyDto, @Req() req: RequestAo) {
    return this.projectService.updateById(id, bodyDto, req.payload.profile.id);
  }

  @Delete('/:id')
  removeById(@Param('id') id: number) {
    return this.projectService.removeById(id);
  }

  @Get()
  getAll(@Query() paginationBaseDto: ReqPaginationBaseDto): Promise<ResPaginationDto<ProjectModel>> {
    return this.projectService.getAll(paginationBaseDto.page, paginationBaseDto.limit);
  }

  @Get('/:id')
  getById(@Param('id') id: number): Promise<ProjectModel | undefined> {
    return this.projectService.getById(id);
  }
}
