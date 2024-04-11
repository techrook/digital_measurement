import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Req,
  UsePipes
} from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMeasurementDto } from './dto';
import { FormDataValidationPipe } from './pipes';

@Controller('measurement')
export class MeasurementController {
  constructor(private measurementService: MeasurementService) {}
  
  @UseGuards(JwtGuard)
  @Post('addmeasurement')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FormDataValidationPipe)
  async addMeasurement(
    @GetUser('id') userId: number,
    @Body() dto: CreateMeasurementDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log(req.body); 
    return this.measurementService.addMeasurement(
      file,
      userId,
      dto.gender,
      dto.cloth_Owner_name,
      dto.chest,
      dto.Waist,
      dto.Hips,
      dto.neck_to_waist,
      dto.waist_down_to_desired_lenght,
      dto.laps,
      dto.wrist,
      dto.ankle,
      dto.shoulders,
      dto.neck,
    );
  }

  @UseGuards(JwtGuard)
  @Get('')
  async getMyMeasurements(@GetUser('id') userId: number) {
    const measurements = await this.measurementService.getMyMeasurements(userId);
    return measurements
  }
  @UseGuards(JwtGuard)
  @Get('/:measurementId')
  async getAMeasurements(
    @GetUser('id') userId: number,
    @Param('measurementId') measurementId: number,
  ) {
    return this.measurementService.getAMeasurements(userId, measurementId);
  }
  @UseGuards(JwtGuard)
  @Put(':id')
  async updateMeasurement(
    @Body() update:object,
    @Param('id') measurementId: number,
  ) {
    return this.measurementService.updateMeasurement(update, measurementId);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @Delete(':measurementId')
  async deleteMeasurement(
    @Param('measurementId') measurementId: number,
  ){
    return this.measurementService.deleteMeasurement(measurementId)
  }
}
