import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  @InjectModel( Pokemon.name )
  private readonly pokeModel: Model<Pokemon>;

  async create(createPokemonDto: CreatePokemonDto) {
    // const pok: {}=this.poke.push({
    //   name: createPokemonDto.name,
    //   no: createPokemonDto.no
    // })
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokeModel.create( createPokemonDto );
      return pokemon;
    } catch (error) {
      this.handleExceptions( error );
    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)){
      pokemon = await this.pokeModel.findOne({ no:term })
    }
    if(!pokemon && isValidObjectId( term )){
      pokemon = await this.pokeModel.findById( term );
    }
    if(!pokemon) {
      pokemon = await this.pokeModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }
    if(!pokemon) {
      throw new NotFoundException(`Pokemon whit id, name or no "${ term }" not found`)
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne( term );
    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    // const pokemon= await this.findOne(id)
    // await pokemon.deleteOne();
    //const result = await this.pokeModel.findByIdAndDelete( id )
    const {deletedCount} = await this.pokeModel.deleteOne({_id: id});
    if (deletedCount=== 0) {
      throw new BadRequestException(`pokemon with id "${id}" not found`)
    }
    return; 
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
