import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeasurementDto } from './dto';

@Injectable()
export class MeasurementService {
    constructor(
        private prisma: PrismaService,

      ){}
        async addMeasurement(userid:number, dto:CreateMeasurementDto){
            try {
                const measurement = await this.prisma.measurement.create({
                   data: {
                    gender: dto.gender,
                    cloth_Owner_name: dto.cloth_Owner_name,
                    userId: userid,
                    ...dto
                   },
                })
                if(!measurement) throw new HttpException("bad request", HttpStatus.BAD_REQUEST)
                return measurement
            } catch (error) {
                throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        
}
