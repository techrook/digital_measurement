import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { CreateMeasurementDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('measurement')
export class MeasurementController {
    constructor(private measurementService:MeasurementService){}

    @Post('addmeasurement')
    addMeasurement(@GetUser('id') userId: number, @Body() dto:CreateMeasurementDto){
        return this.measurementService.addMeasurement(userId, dto)
    }
}
