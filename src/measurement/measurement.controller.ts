import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { CreateMeasurementDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
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
      neck
    );
  }

  //   @Post('upload')
  //   @UseInterceptors(FileInterceptor('file')) // 'file' is the field name for the uploaded file in the request
  //   async uploadImage(@UploadedFile() file: Express.Multer.File) {
  //     try {
  //       const imageUrl = await this.measurementService.uploadImage(file);
  //       return { message: 'Image uploaded successfully', imageUrl };
  //     } catch (error) {
  //       throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
}
