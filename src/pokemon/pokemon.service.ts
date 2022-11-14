import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    }catch(error){
      this.handleExceptions(error)
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    //Buscar por Mongo ID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //Buscar pokemon por nombre
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()});
    }

    // En el caso que no encuentre en pokemon por ID normal
    if(!pokemon)throw new NotFoundException(`El pokemon garka con ID o nombre: "${term}" no se encontró`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    try{
      const pokemon = await this.findOne(term);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      await pokemon.updateOne(updatePokemonDto);
    return { ...pokemon.toJSON(), ...updatePokemonDto};
    }catch(error){
      this.handleExceptions(error);
    }
    
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
  // const result = await this.pokemonModel.findByIdAndDelete(id);

  const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

  if(deletedCount===0)
    throw new BadRequestException(`El pokemon con el id "${id}" no se ha encontrado`);

    return;
  }

  // Método para manejar errores duplicados
  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Garka, el ID o nombre: "${JSON.stringify(error.keyValue)}" está asigando a otro Pokemon`)
    }
    console.log(error);
    throw new InternalServerErrorException(`Garka, mira hay un error.`)

  }
}
