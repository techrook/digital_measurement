import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeasurementDto } from './dto';
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import * as path from 'path';
@Injectable()
export class MeasurementService {
  keyFilePath = path.resolve(__dirname, 'digitalmeasurement.json');
  constructor(private prisma: PrismaService) {}
  async addMeasurement(
    file: Express.Multer.File,
    userid: number,
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
  ) {
    try {
      const storage = new Storage({
        keyFilename: this.keyFilePath,
      });

      const digitameasurementbucket = 'digitameasurementbucket'; // Replace with your actual bucket name
      const bucket = storage.bucket(digitameasurementbucket);
      const uniqueFilename = `${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(uniqueFilename);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (err) => {
        console.log(err);
      });

      stream.on('finish',async () => {
        // Save the image URL to the database after successful upload
       console.log('finished image upload')
      });
      stream.end(file.buffer);
      const imageUrl = `https://storage.googleapis.com/${digitameasurementbucket}/${uniqueFilename}`;
      const measurement = await this.prisma.measurement.create({
        data: {
          gender: gender,
          cloth_Owner_name: cloth_Owner_name,
          chest: Number(chest),
          Waist: Number(Waist),
          Hips: Number(Hips),
          neck_to_waist: Number(neck_to_waist),
          waist_down_to_desired_lenght: Number(waist_down_to_desired_lenght),
          laps: Number(laps),
          wrist: Number(wrist),
          ankle: Number(ankle),
          shoulders: Number(shoulders),
          neck: Number(neck),
          userId: userid,
          dress_design: imageUrl,
        },
      });
      console.log(imageUrl);
      if (!measurement)
        throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      return measurement;
    } catch (error) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
