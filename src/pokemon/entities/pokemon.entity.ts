import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { UpdatePokemonDto } from "../dto/update-pokemon.dto";
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
    @Prop({
        unique: true,
        index: true,
    })
    name: string

    @Prop({
        unique: true,
        index: true,
    })
    no: number
}

export const PokemonSchema = SchemaFactory.createForClass( Pokemon );