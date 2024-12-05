import { NextResponse } from "next/server";
import Board from "@/model/board";
import connectMongo from "@/db/mongoose";

export async function POST(request: Request) {
	try {
	  const { name } = await request.json();
	  if (!name) {
		return NextResponse.json({ error: "Board name is required" }, { status: 400 });
	  }

	  await connectMongo();
	  const newBoard = new Board({ name });
	  await newBoard.save();
	  return NextResponse.json(newBoard, { status: 201 });
	} catch (error) {
	  console.error("Error adding new board:", error);
	  return NextResponse.json({ error: "Failed to add new board" }, { status: 500 });
	}
}