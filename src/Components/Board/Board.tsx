import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "../Card/Card"
import Dropdown from "../Dropdown/Dropdown";
import CustomInput from "../CustomInput/CustomInput";

import "./Board.css";
import { IBoard, ICard } from "../../Interfaces/Trello";

interface BoardProps {
  board: IBoard;
  addCard: (boardId: number, title: string) => void;
  removeBoard: (boardId: number) => void;
  removeCard: (boardId: number, cardId: number) => void;
  onDragEnd: (boardId: number, cardId: number) => void;
  onDragEnter: (boardId: number, cardId: number) => void;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
}

function Board(props: BoardProps) {
  const {
    board,
    addCard,
    removeBoard,
    removeCard,
    onDragEnd,
    onDragEnter,
    updateCard,
  } = props;
  const [showDropdown, setShowDropdown] = useState(false);

  const completedTasks = board.carte.reduce((acc, card) => {
    return acc + (card.tasks?.filter(t => t.copleted)?.length || 0);
  }, 0);
  const totalTasks = board.carte.reduce((acc, card) => {
    return acc + (card.tasks?.length || 0);
  }, 0);

  return (
    <div className="board">
      <div className="board-inner" key={board?.id}>
        <div className="board-header">
          <div className="board-header-left">
            <p className="board-header-title">
              {board?.nom}
            </p>
            <span className="board-header-count">{board?.carte?.length || 0}</span>
          </div>
          <div
            className="board-header-title-more"
            onClick={() => setShowDropdown(true)}
          >
            <MoreHorizontal size={18} />
            {showDropdown && (
              <Dropdown
                class="board-dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <p onClick={() => removeBoard(board?.id)}>
                  <span className="dropdown-icon">✕</span>
                  Supprimer la liste
                </p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="board-cards custom-scroll">
          {board?.carte?.map((item) => (
            <Card
              key={item.id}
              card={item}
              boardId={board.id}
              removeCard={removeCard}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              updateCard={updateCard}
            />
          ))}

          <CustomInput
            text="+ Ajouter une carte"
            placeholder="Entrez le titre de la carte"
            displayClass="board-add-card"
            editClass="board-add-card-edit"
            onSubmit={(value: string) => addCard(board?.id, value)}
          />
        </div>
        {totalTasks > 0 && (
          <div className="board-footer">
            <div className="board-footer-progress">
              <div
                className="board-footer-progress-bar"
                style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }}
              />
            </div>
            <span className="board-footer-text">
              {completedTasks}/{totalTasks} tâches
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default Board;
