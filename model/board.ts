import mongoose, { model, models, Schema, Types } from "mongoose";

export interface Card {
	description: string;
	name: string;
}

export interface List {
	name: string;
	cards: Card[];
}

export interface BoardInterface {
	_id: string;
	name: string;
	lists: List[];
}

const cardSchema = new mongoose.Schema({
	name: String,
	description: String,
	_id: String,
});
  
const listSchema = new mongoose.Schema({
	name: String,
	cards: [cardSchema],
});
  

const BoardSchema = new Schema<BoardInterface>({
	name: { type: String, required: true },
	lists: [
		{
		name: { type: String, required: true },
		cards: [
			{
			name: { type: String, required: true },
			description: { type: String, required: false },
			},
		],
		},
	],
});

const Board = models.Board || model<BoardInterface>("Board", BoardSchema, "Boards");


export default Board;
