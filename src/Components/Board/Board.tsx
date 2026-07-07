import React, { useState } from "react";
import { MoreHorizontal, Star, Archive, Edit3 } from "react-feather";

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
  renameBoard: (boardId: number, name: string) => void;
  toggleFavorite: (boardId: number) => void;
  archiveBoard: (boardId: number) => void;
  copyCard: (boardId: number, cardId: number) => void;
  archiveCard: (boardId: number, cardId: number) => void;
  toggleWatch: (cardId: number) => void;
  selectedCards: Set<number>;
  toggleSelectCard: (cardId: number) => void;
}

function Board(props: BoardProps) {
  const {
    board, addCard, removeBoard, removeCard, onDragEnd, onDragEnter, updateCard,
    renameBoard, toggleFavorite, archiveBoard, copyCard, archiveCard, toggleWatch, selectedCards, toggleSelectCard,
  } = props;
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(board.nom);

  const completedTasks = board.carte.reduce((acc, card) => {
    return acc + (card.tasks?.filter(t => t.copleted)?.length || 0);
  }, 0);
  const totalTasks = board.carte.reduce((acc, card) => {
    return acc + (card.tasks?.length || 0);
  }, 0);

  const handleRename = () => {
    if (editName.trim() && editName !== board.nom) {
      renameBoard(board.id, editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="board" style={board.color ? { borderTop: `3px solid ${board.color}` } : {}}>
      <div className="board-inner" key={board?.id}>
        <div className="board-header">
          <div className="board-header-left">
            {isEditing ? (
              <input
                className="board-rename-input"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={e => e.key === "Enter" && handleRename()}
                autoFocus
              />
            ) : (
              <p className="board-header-title" onClick={() => { setEditName(board.nom); setIsEditing(true); }}>
                {board?.nom}
                <Edit3 size={12} className="edit-icon" />
              </p>
            )}
            <span className="board-header-count">{board?.carte?.length || 0}</span>
            {board.favorite && <Star size={14} className="star-icon filled" />}
          </div>
          <div className="board-header-actions">
            <button className="board-fav-btn" onClick={() => toggleFavorite(board.id)} title={board.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}>
              <Star size={15} className={board.favorite ? "filled" : ""} />
            </button>
            <div className="board-header-title-more" onClick={() => setShowDropdown(true)}>
              <MoreHorizontal size={18} />
              {showDropdown && (
                <Dropdown class="board-dropdown" onClose={() => setShowDropdown(false)}>
                  <p onClick={() => { archiveBoard(board?.id); setShowDropdown(false); }}>
                    <Archive size={14} /> Archiver la liste
                  </p>
                  <p onClick={() => { removeBoard(board?.id); setShowDropdown(false); }}>
                    <span className="dropdown-icon">✕</span> Supprimer
                  </p>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
        <div className="board-cards custom-scroll">
          {board?.carte?.filter(c => !c.archived).map((item) => (
            <Card
              key={item.id}
              card={item}
              boardId={board.id}
              removeCard={removeCard}
              onDragEnter={onDragEnter}
              onDragEnd={onDragEnd}
              updateCard={updateCard}
              copyCard={copyCard}
              archiveCard={archiveCard}
              toggleWatch={toggleWatch}
              selected={selectedCards.has(item.id)}
              toggleSelect={() => toggleSelectCard(item.id)}
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
              <div className="board-footer-progress-bar" style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }} />
            </div>
            <span className="board-footer-text">{completedTasks}/{totalTasks}</span>
          </div>
        )}
      </div>
    </div>
  );
}
export default Board;
