import { NextResponse } from 'next/server';
import Board from '@/model/board';
import { createCard, getBoardItem} from '@/app/actions';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    if (body.name) {
      const board = await Board.findById(id);
      if (!board) {
        return NextResponse.json({ message: 'Board not found' }, { status: 404 });
      }

      board.name = body.name;
      await board.save();

      return NextResponse.json(board);
    }
    const { listName, cardName, cardDescription } = body;

    if (!listName || !cardName || !cardDescription) {
      return NextResponse.json({ message: 'List name, card name, and card description are required' }, { status: 400 });
    }

    const board = await Board.findById(id);
    if (!board) {
      return NextResponse.json({ message: 'Board not found' }, { status: 404 });
    }
    let list = board.lists.find((list) => list.name === listName);
    if (!list) {
      list = { name: listName, cards: [] };
      board.lists.push(list);
    }
    let card = list.cards.find((card) => card.name === cardName);
    if (!card) {
      card = { name: cardName, description: cardDescription };
      list.cards.push(card);
    } else {
      card.description = cardDescription;
    }

    await board.save();

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error updating board or card:', error);
    return NextResponse.json({ message: 'Error updating board or card', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { boardId: string } }) {
  const { boardId } = params;
  const { cardName } = await request.json();

  try {
    const newCard = await createCard(boardId, cardName);
    return NextResponse.json(newCard);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const board = await Board.findById(id);
    if (!board) {
      return NextResponse.json({ message: 'Board not found' }, { status: 404 });
    }
    await Board.deleteOne({ _id: id });
    return NextResponse.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json({ message: 'Error deleting board', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { boardId: string } }) {
  const { boardId } = params;

  try {
    const boardData = await getBoardItem(boardId);
    return NextResponse.json(boardData);
  } catch (error) {
    return NextResponse.error();
  }
}

