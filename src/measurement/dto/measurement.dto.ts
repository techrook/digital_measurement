import { IsInt, IsString, IsNotEmpty, Min,  } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsString()
  @IsNotEmpty()
  cloth_Owner_name?: string;

  @IsInt()
  @Min(0)
  chest?: number;

  @IsInt()
  @Min(0)
  Waist?: number;

  @IsInt()
  @Min(0)
  Hips?: number;

  @IsInt()
  @Min(0)
  neck_to_waist?: number;

  @IsInt()
  @Min(0)
  waist_down_to_desired_lenght?: number;

  @IsInt()
  @Min(0)
  laps?: number;

  @IsInt()
  @Min(0)
  wrist?: number;

  @IsInt()
  @Min(0)
  ankle?: number;

  @IsInt()
  @Min(0)
  shoulders?: number;

  @IsInt()
  @Min(0)
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
