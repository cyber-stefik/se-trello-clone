"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBoardItem } from "@/app/actions";
import { BoardInterface, Card, List } from '@/model/board';

export default function BoardPage() {
  const router = useRouter();
  const { id } = useParams();
  const [board, setBoard] = useState<BoardInterface | null>(null);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState<string>('');
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newCardName, setNewCardName] = useState<string>('');
  const [newCardDescription, setNewCardDescription] = useState<string>('');
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [listName, setListName] = useState<string>('');

  useEffect(() => {
    if (id) {
      getBoardItem(id as string)
        .then((data) => setBoard(data))
        .catch((error: Error) => console.error('Error fetching board data:', error));
    }
  }, [id]);
  
  const handleEditList = (listName: string) => {
    setEditingList(listName);
    setNewListName(listName);
    setShowModal(true);
  };

  const handleSubmitEditList = async () => {
    if (!board || !editingList || !newListName) {
      console.error('Missing data for updating list');
      return;
    }

    try {
      const response = await fetch(`/api/boards/${board._id}/list`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldListName: editingList,
          newListName,
        }),
      });

      if (response.ok) {
        const updatedBoard = await response.json();
        setBoard(updatedBoard);
        setShowModal(false);
      } else {
        const data = await response.json();
        console.error('Failed to update list name:', data.message);
      }
    } catch (error) {
      console.error('Error updating list name:', error);
    }
  };

  const handleCreateCard = (listName: string) => {
    setListName(listName);
    setShowCardModal(true);
  };

  const handleSubmitAddCard = async () => {
    console.log('Submitting card with:', listName, newCardName, newCardDescription);
    try {
      const response = await fetch(`/api/boards/${board?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listName: listName,
          cardName: newCardName,
          cardDescription: newCardDescription,
        }),
      });
  
      if (response.ok) {
        const updatedBoard = await response.json();
        setBoard(updatedBoard);
      } else {
        const data = await response.json();
        console.error('Failed to add card:', data.message);
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }

    setNewCardName('');
    setNewCardDescription('');
    setShowCardModal(false);
  };
  
  
  

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-mono">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-semibold text-center mb-8">{board?.name}</h1>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {board?.lists.map((list: any) => (
            <div key={list.name} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-800">{list.name}</h2>
                <div className="space-x-4">
                  <button
                    onClick={() => handleEditList(list.name)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
                  >
                    Edit list name
                  </button>
                  <button
                    onClick={() => handleCreateCard(list.name)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                  >
                    Create Card
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {list.cards.map((card: any) => (
                  <div key={card.name} className="bg-blue-50 p-4 rounded-md shadow-md space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-700">{card.name}</h3>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">{card.description}</p>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-medium text-gray-800 mb-4">Edit List Name</h2>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitEditList}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showCardModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-medium text-gray-800 mb-4">Create New Card</h2>
              <input
                type="text"
                value={newCardName}
                onChange={(e) => setNewCardName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Enter card name"
              />
              <textarea
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Enter card description"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAddCard}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
