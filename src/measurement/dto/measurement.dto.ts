import { IsInt, IsString } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  gender?: string;

  @IsString()
  cloth_Owner_name?: string;

  @IsInt()
  chest?: number;

  @IsInt()
  Waist?: number;

  @IsInt()
  Hips?: number;

  @IsInt()
  neck_to_waist?: number;

  @IsInt()
  waist_down_to_desired_lenght?: number;

  @IsInt()
  laps?: number;

  @IsInt()
  wrist?: number;

  @IsInt()
  ankle?: number;

  @IsInt()
  shoulders?: number;

  @IsInt()
  neck?: number;

  @IsString()
  dress_design?: string;
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
