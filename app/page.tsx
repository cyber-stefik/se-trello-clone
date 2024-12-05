/**
 * This following line is required to make the getItems function is called on every request and not just pre-rendered at build time.
 * Normally db results are not pre-rendered at build time if there are URL params, query params, cookies, or headers on which the result depends.
 * In this unique case, the getItems does not depend on any of these, but we still want to call it on every request.
 * This is a work around and not representative of a typical use case in which you would have login for users and the todo list will depend on the user (some set headers and/or cookies).
 */
export const dynamic = "force-dynamic";

import { getBoardItems } from "@/app/actions";
import connectMongo from "@/db/mongoose";
import BoardList from "./components/BoardList";

export default async function Home() {
  await connectMongo(); // Ensure MongoDB connection is established.
  const boardsInitial = await getBoardItems(); // Fetch boards from the database
  return (
    <div className="flex justify-center font-mono">
      <BoardList boardsInitial={boardsInitial} />
    </div>
  );
}

