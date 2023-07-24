import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class MeasurementService {
  s3BucketName: string;
  s3Client: S3Client;

  constructor(private prisma: PrismaService) {
    // Retrieve AWS credentials from environment variables
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    // Ensure AWS credentials are defined
    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS credentials are missing. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.',
      );
    }
    // Set AWS region
    const region = 'us-east-1'; // Replace with your desired AWS region

    // Initialize S3 client with AWS credentials and region
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Set S3 bucket name from environment variable
    this.s3BucketName = process.env.S3_BUCKET_NAME || 'default-s3-bucket-name';
  }
  async addMeasurement(
    file: Express.Multer.File,
    userid: number,
    gender: string,
    cloth_Owner_name: string,
    chest: number,
    Waist: number,
    Hips: number,
    neck_to_waist: number,
    waist_down_to_desired_lenght: number,
    laps: number,
    wrist: number,
    ankle: number,
    shoulders: number,
    neck: number,
  ) {
    try {
      const uniqueFilename = `${Date.now()}-${file.originalname}`;

      const putObjectCommand = new PutObjectCommand({
        Bucket: this.s3BucketName,
        Key: uniqueFilename,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });
      const response = await this.s3Client.send(putObjectCommand);

      const imageUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${file.originalname}`;
      console.log(imageUrl);
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
      if (!measurement)
        throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      return measurement;
    } catch (error) {
      if (error) {
        console.error('Error metadata:', error);
      }
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getMyMeasurements(userid: number) {
    try {
      const measurement = await this.prisma.measurement.findMany({
        where: {
          userId: userid,
        },
      });
      if (!measurement)
        throw new HttpException('No Meassurements found', HttpStatus.NOT_FOUND);
      return measurement;
    } catch (error) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getAMeasurements(userid: number, measurementId: number) {
    try {
      const measurement = await this.prisma.measurement.findMany({
        where: {
          userId: userid,
          id: Number(measurementId),
        },
      });
      if (!measurement)
        throw new HttpException(
          ' Meassurement not found',
          HttpStatus.NOT_FOUND,
        );
      return measurement;
    } catch (error) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
