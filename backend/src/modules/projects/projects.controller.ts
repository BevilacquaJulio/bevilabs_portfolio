import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto, type Paginated } from '../../common/dto/pagination.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';
import type { ProjectRecord } from './projects.repository';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista paginada dos projetos publicados' })
  list(@Query() query: PaginationDto): Promise<Paginated<ProjectRecord>> {
    return this.projectsService.list(query.page, query.limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de um projeto' })
  findOne(@Param('id') id: string): Promise<ProjectRecord> {
    return this.projectsService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um projeto (admin)' })
  create(@Body() body: CreateProjectDto): Promise<ProjectRecord> {
    return this.projectsService.create(body);
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um projeto (admin)' })
  update(@Param('id') id: string, @Body() body: UpdateProjectDto): Promise<ProjectRecord> {
    return this.projectsService.update(id, body);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um projeto (admin)' })
  remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}
