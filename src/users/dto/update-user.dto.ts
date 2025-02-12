import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNumber()
    @IsPositive()
    usua_id: number;

    @IsOptional()
    @IsInt()
    updatedBy?: number;
}
