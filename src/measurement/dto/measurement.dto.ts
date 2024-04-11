import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateMeasurementDto {
  @IsString({ message: 'Gender must be a string' })
  @IsNotEmpty({ message: 'Gender cannot be empty' })
  gender?: string;

  @IsString({ message: 'Cloth owner name must be a string' })
  @IsNotEmpty({ message: 'Cloth owner name cannot be empty' })
  cloth_Owner_name?: string;

  @IsInt({ message: 'Chest must be an integer' })
  @Min(0, { message: 'Chest must be at least 0' })
  chest?: number;

  @IsInt({ message: 'Waist must be an integer' })
  @Min(0, { message: 'Waist must be at least 0' })
  Waist?: number;

  @IsInt({ message: 'Hips must be an integer' })
  @Min(0, { message: 'Hips must be at least 0' })
  Hips?: number;

  @IsInt({ message: 'Neck to waist must be an integer' })
  @Min(0, { message: 'Neck to waist must be at least 0' })
  neck_to_waist?: number;

  @IsInt({ message: 'Waist down to desired length must be an integer' })
  @Min(0, { message: 'Waist down to desired length must be at least 0' })
  waist_down_to_desired_lenght?: number;

  @IsInt({ message: 'Laps must be an integer' })
  @Min(0, { message: 'Laps must be at least 0' })
  laps?: number;

  @IsInt({ message: 'Wrist must be an integer' })
  @Min(0, { message: 'Wrist must be at least 0' })
  wrist?: number;

  @IsInt({ message: 'Ankle must be an integer' })
  @Min(0, { message: 'Ankle must be at least 0' })
  ankle?: number;

  @IsInt({ message: 'Shoulders must be an integer' })
  @Min(0, { message: 'Shoulders must be at least 0' })
  shoulders?: number;

  @IsInt({ message: 'Neck must be an integer' })
  @Min(0, { message: 'Neck must be at least 0' })
  neck?: number;
}

export class UpdateMeasurementDto {
  gender?: string;
  cloth_Owner_name?: string;
  chest?: number;
  Waist?: number;
  Hips?: number;
  neck_to_waist?: number;
  waist_down_to_desired_lenght?: number;
  laps?: number;
  wrist?: number;
  ankle?: number;
  shoulders?: number;
  neck?: number;
}
