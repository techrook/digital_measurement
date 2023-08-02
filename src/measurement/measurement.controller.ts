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
  Render,
} from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('measurement')
export class MeasurementController {
  constructor(private measurementService: MeasurementService) {}

  @Post('addmeasurement')
  @UseInterceptors(FileInterceptor('file'))
  async addMeasurement(
    @GetUser('id') userId: number,
    @Body('gender') gender: string,
    @Body('cloth_Owner_name') cloth_Owner_name: string,
    @Body('chest') chest: number,
    @Body('Waist') Waist: number,
    @Body('Hips') Hips: number,
    @Body('neck_to_waist') neck_to_waist: number,
    @Body('waist_down_to_desired_lenght') waist_down_to_desired_lenght: number,
    @Body('laps') laps: number,
    @Body('wrist') wrist: number,
    @Body('ankle') ankle: number,
    @Body('shoulders') shoulders: number,
    @Body('neck') neck: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.measurementService.addMeasurement(
      file,
      userId,
      gender,
      cloth_Owner_name,
      chest,
      Waist,
      Hips,
      neck_to_waist,
      waist_down_to_desired_lenght,
      laps,
      wrist,
      ankle,
      shoulders,
      neck,
    );
  }
  @Get('home')
  @Render('home.hbs') // Render the "signup" view
  home() {
    return { message: 'home' };
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
    @Body() update,
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
