import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class FormDataValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert string values to numbers for numeric fields
    for (const key in value) {
      if (typeof value[key] === 'string' && !isNaN(+value[key])) {
        if (key === 'gender' || key === 'cloth_Owner_name') {
          // Leave string fields as they are
          continue;
        }
        // Convert numeric fields to numbers
        value[key] = +value[key];
      }
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed, ${errors}`);
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
