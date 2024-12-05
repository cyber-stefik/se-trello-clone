"use server";

import connectMongo from "@/db/mongoose";
import { Types } from "mongoose";
import Board, {BoardInterface} from "@/model/board";

export async function getBoardItems(): Promise<BoardInterface[]> {
	try {
		await connectMongo();
		const BoardInterfaces = await Board.find({}).lean<BoardInterface[]>();
		const formattedBoards = BoardInterfaces.map((BoardInterface) => ({
			_id: BoardInterface._id.toString(),
			name: BoardInterface.name,
			lists: [],
		}));
		return formattedBoards;
	} catch (e) {
		console.error(e);
		throw e;
	}
}


export async function getBoardItem(id: string): Promise<BoardInterface> {
	try {
	  await connectMongo();
	  const board = await Board.findById(id).lean();
	  if (!board) {
		throw new Error('Board not found');
	  }
	  const formattedBoard: BoardInterface = {
		_id: board._id.toString(),
		name: board.name,
		lists: board.lists,
	  };
	  return formattedBoard;
	} catch (e) {
	  console.error('Error fetching board:', e);
	  throw e;
	}
}

export async function updateBoard(boardId: string, boardName: string): Promise<BoardInterface> {
	const response = await fetch(`/api/boards/${boardId}`, {
	  method: 'PUT',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({ boardName }),
	});
  
	if (!response.ok) throw new Error('Failed to update the board');
	return await response.json();
  }

  export async function updateBoardList(boardId: string, listName: string, newListName: string): Promise<BoardInterface> {
	console.log("updateBoardList: ", boardId, listName, newListName);
	
	const response = await fetch(`/api/boards/${boardId}`, {
	  method: 'PUT_LIST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({ listName, newListName }),
	});
  
	if (!response.ok) throw new Error('Failed to update list');
	
	return await response.json();
  }

export async function createCard(boardId: string, cardName: string): Promise<any> {
	const response = await fetch(`/api/boards/${boardId}/add-card`, {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  body: JSON.stringify({ cardName }),
	});
  
	if (!response.ok) throw new Error('Failed to create card');
	return await response.json();
  }

export async function createBoardItem(name: BoardInterface["name"]) {
	try {
		await connectMongo();
		const newBoard = new Board({
			_id: new Types.ObjectId(),
			name,
		});
		await newBoard.save();
		console.log("Created new Board:", newBoard);
	} catch (e) {
		console.error(e);
		throw e;
	}
}
