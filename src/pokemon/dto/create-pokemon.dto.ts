import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {

    //IsInt, IsPositive, min 1
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    // IsString, Minlength 1
    @IsString()
    @MinLength(1)
    name: string;
}
