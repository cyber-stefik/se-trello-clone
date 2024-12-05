import { NextResponse } from 'next/server';
import Board, { List } from '@/model/board';

async function findBoardById(boardId: string) {
	const board = await Board.findById(boardId);
	if (!board) {
	  throw new Error('Board not found');
	}
	return board;
  }
  
  async function updateBoardName(board: any, newName: string) {
	board.name = newName;
	await board.save();
	return board;
  }

  function findListByName(board: any, listName: string) {
	return board.lists.find((list: any) => list.name === listName);
  }
  
  async function addOrUpdateCard(board: any, listName: string, cardName: string, cardDescription: string) {
	let list = findListByName(board, listName);
	if (!list) {
	  list = { name: listName, cards: [] };
	  board.lists.push(list);
	}
  
	let card = list.cards.find((card: any) => card.name === cardName);
	if (!card) {
	  card = { name: cardName, description: cardDescription };
	  list.cards.push(card);
	} else {
	  card.description = cardDescription;
	}
  
	await board.save();
	return board;
  }

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	try {
	  const { id } = params;
	  const body = await req.json();
  
	  if (body.name) {
		const board = await findBoardById(id);
		const updatedBoard = await updateBoardName(board, body.name);
		return NextResponse.json(updatedBoard);
	  }

	  const { listName, cardName, cardDescription } = body;
	  if (!listName || !cardName || !cardDescription) {
		return NextResponse.json({ message: 'List name, card name, and card description are required' }, { status: 400 });
	  }
  
	  const board = await findBoardById(id);
	  const updatedBoard = await addOrUpdateCard(board, listName, cardName, cardDescription);
  
	  return NextResponse.json(updatedBoard);
	} catch (error) {
	  const err = error as Error;
	  console.error('Error processing request:', err.message);
	  return NextResponse.json({ message: 'Error processing request', error: err.message }, { status: 500 });
	}
  }

export async function POST(req: Request, { params }: { params: { boardId: string } }) {
	try {
		const { boardId } = params;
		const { listName, cardName, cardDescription } = await req.json();
		console.log('Creating card with:', listName, cardName, cardDescription, boardId);

		if (!listName || !cardName || !cardDescription) {
		return NextResponse.json({ message: 'List name, card name, and card description are required' }, { status: 400 });
		}
		const board = await Board.findById(boardId);
		if (!board) {
			return NextResponse.json({ message: 'Board not found' }, { status: 404 });
		}

		const list = board.lists.find((list: List) => list.name === listName);
		if (!list) {
		return NextResponse.json({ message: 'List not found' }, { status: 404 });
		}
		const newCard = { name: cardName, description: cardDescription };
		list.cards.push(newCard);

		await board.save();
		return NextResponse.json(board);
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ message: 'Error adding card', error: err.message }, { status: 500 });
	}
}