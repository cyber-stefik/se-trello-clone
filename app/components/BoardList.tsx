"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Board, { BoardInterface } from "@/model/board";

/**
 * We try to infer the type returned by the `getItems` function which is async/a promise.
 */
type BoardListProps = {
  boardsInitial: BoardInterface[];
};

export default function BoardList({ boardsInitial }: BoardListProps) {
  const [boards, setBoards] = useState<BoardInterface[]>(boardsInitial);
  const [newBoardName, setNewBoardName] = useState('');
  const [newAddBoardName, setNewAddBoardName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoardName, setCurrentBoardName] = useState<string | null>(null);
  const router = useRouter();

  const handleEditBoard = (id: string, newName: string) => {
    const updatedBoards = boards.map((board) =>
      board._id === id ? { ...board, name: newName } : board
    );
    setBoards(updatedBoards);
  };

  const openModal = (id: string, currentName: string) => {
    setCurrentBoardId(id);
    setNewBoardName(currentName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitEdit = async () => {
    if (!currentBoardId || !newBoardName) {
      alert('Board ID and name are required');
      return;
    }
  
    try {
      const response = await fetch(`/api/boards/${currentBoardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newBoardName }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update board');
      }
  
      const updatedBoard = await response.json();
      handleEditBoard(updatedBoard._id, updatedBoard.name);
      closeModal();
    } catch (error) {
      console.error('Error editing board:', error);
    }
  };
  

  const handleAddBoard = async () => {
    if (!newAddBoardName.trim()) return;

    try {
      const response = await fetch(`/api/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newAddBoardName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create board');
      }

      const newBoard = await response.json();
      setBoards([...boards, newBoard]);
      setNewAddBoardName('');
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setCurrentBoardId(id);
    setCurrentBoardName(name);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBoard = async () => {
    if (!currentBoardId) return;

    try {
      const response = await fetch(`/api/boards/${currentBoardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete board');
      }

      setBoards(boards.filter((board) => board._id !== currentBoardId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div className="grow max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-6">Boards</h1>

      {/* Add New Board Section */}
      <div className="flex mb-6">
        <input
          type="text"
          className="input input-bordered w-full mr-4"
          placeholder="Enter new board name"
          value={newAddBoardName}
          onChange={(e) => setNewAddBoardName(e.target.value)}
        />
        <button
          onClick={handleAddBoard}
          className="btn btn-primary px-6 py-3 text-lg font-semibold bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition duration-300"
        >
          Add New Board
        </button>
      </div>

      {boards.map((board) => (
        <div key={board._id} className="rounded-lg border p-6 shadow-md mb-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-semibold mb-4">{board.name}</h2>
          <div className="space-x-4">
            <button
              onClick={() => router.push(`/boards/${board._id}`)}
              className="btn btn-primary px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300"
            >
              Display Board
            </button>
            <button
              onClick={() => openModal(board._id, board.name)}
              className="btn btn-primary px-6 py-3 text-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-300"
            >
              Edit Board
            </button>
            <button
              onClick={() => openDeleteModal(board._id, board.name)}
              className="btn btn-primary px-6 py-3 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
            >
              Delete Board
            </button>
          </div>
        </div>
      ))}

      {/* Modal for Editing Board */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
          <div className="modal modal-open">
            <div className="modal-box bg-white rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Edit Board Name</h2>
              <input
                type="text"
                className="input input-bordered w-full mb-4"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter new board name"
              />
              <div className="flex justify-end space-x-4">
                <button onClick={closeModal} className="btn btn-secondary">Cancel</button>
                <button onClick={handleSubmitEdit} className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50 backdrop-blur-sm">
          <div className="modal modal-open">
            <div className="modal-box bg-white rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this board?</h2>
              <p>This action is permanent and cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleDeleteBoard} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
