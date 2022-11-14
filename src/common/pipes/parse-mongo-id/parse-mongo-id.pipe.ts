import { isValidObjectId } from 'mongoose';
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log({value, metadata});

    if (!isValidObjectId(value)){
      throw new BadRequestException(`"${value}" no es un Mongo ID válido`)
    }

    return value;
  }
}
