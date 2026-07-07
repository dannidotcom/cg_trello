import React, { useEffect, useState } from "react";
import Board from "../Components/Board/Board";
import "./Dashboard.css";
import CustomInput from "../Components/CustomInput/CustomInput";
import { ICard, IBoard } from "../Interfaces/Trello";
import { fetchBoardList, updateLocalStorageBoards } from "../Helper/ApiData";

function Dashboard() {
  const [boards, setBoards] = useState<IBoard[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const boards: IBoard[] = await fetchBoardList();
    setBoards(boards);
  }

  const [targetCard, setTargetCard] = useState({
    boardId: 0,
    cardId: 0,
  });

  const addboardHandler = (name: string) => {
    const tempBoardsList = [...boards];
    const newBoard: IBoard = {
      id: Date.now(),
      nom: name,
      carte: [],
    };
    tempBoardsList.push(newBoard);
    setBoards(tempBoardsList);
  };

  const removeBoard = (boardId: number) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;
    const tempBoardsList = [...boards];
    tempBoardsList.splice(boardIndex, 1);
    setBoards(tempBoardsList);
  };

  const addCardHandler = (tableau_id: number, title: string) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === tableau_id);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const newCard: ICard = {
      id: Date.now(),
      title,
      labels: [],
      date: "",
      tasks: [],
      user: [],
      description: "",
    };
    tempBoardsList[boardIndex].carte.push(newCard);
    setBoards(tempBoardsList);
  };

  const removeCard = (boardId: number, cardId: number) => {
    const boardIndex = boards.findIndex((item: IBoard) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].carte;
    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;
    cards.splice(cardIndex, 1);
    setBoards(tempBoardsList);
  };

  const updateCard = (boardId: number, cardId: number, card: ICard) => {
    const boardIndex = boards.findIndex((item) => item.id === boardId);
    if (boardIndex < 0) return;

    const tempBoardsList = [...boards];
    const cards = tempBoardsList[boardIndex].carte;
    const cardIndex = cards.findIndex((item) => item.id === cardId);
    if (cardIndex < 0) return;
    tempBoardsList[boardIndex].carte[cardIndex] = card;
    setBoards(tempBoardsList);
  };

  const onDragEnd = (boardId: number, cardId: number) => {
    const sourceBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === boardId,
    );
    if (sourceBoardIndex < 0) return;

    const sourceCardIndex = boards[sourceBoardIndex]?.carte?.findIndex(
      (item) => item.id === cardId,
    );
    if (sourceCardIndex < 0) return;

    const targetBoardIndex = boards.findIndex(
      (item: IBoard) => item.id === targetCard.boardId,
    );
    if (targetBoardIndex < 0) return;

    const targetCardIndex = boards[targetBoardIndex]?.carte?.findIndex(
      (item) => item.id === targetCard.cardId,
    );
    if (targetCardIndex < 0) return;

    const tempBoardsList = [...boards];
    const sourceCard = tempBoardsList[sourceBoardIndex].carte[sourceCardIndex];
    tempBoardsList[sourceBoardIndex].carte.splice(sourceCardIndex, 1);
    tempBoardsList[targetBoardIndex].carte.splice(
      targetCardIndex,
      0,
      sourceCard,
    );
    setBoards(tempBoardsList);
    setTargetCard({
      boardId: 0,
      cardId: 0,
    });
  };

  const onDragEnter = (boardId: number, cardId: number) => {
    if (targetCard.cardId === cardId) return;
    setTargetCard({
      boardId: boardId,
      cardId: cardId,
    });
  };

  useEffect(() => {
    updateLocalStorageBoards(boards);
  }, [boards]);

  return (
    <div className="app">
      <div className="app-nav">
        <div className="app-nav-left">
          <div className="app-logo">
            <span className="app-logo-icon">◆</span>
            <h1>CG Trello</h1>
          </div>
          <span className="app-nav-separator" />
          <span className="app-nav-subtitle">Tableau Kanban</span>
        </div>
        <div className="app-nav-right">
          <span className="app-nav-stats">{boards.reduce((acc, b) => acc + b.carte.length, 0)} cartes</span>
          <div className="app-nav-dot" />
          <span className="app-nav-stats">{boards.length} listes</span>
        </div>
      </div>
      <div className="app-boards-container">
        <div className="app-boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              updateCard={updateCard}
            />
          ))}
          <div className="app-boards-last">
            <CustomInput
              displayClass="app-boards-add-board"
              editClass="app-boards-add-board-edit"
              placeholder="Entrez le nom du tableau"
              text="+ Ajouter une liste"
              buttonText="Ajouter"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>);
}
export default Dashboard;
