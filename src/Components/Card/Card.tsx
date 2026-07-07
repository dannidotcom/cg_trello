import React, { useState } from "react";
import { AlignLeft, CheckSquare, Clock, MoreHorizontal, Trash, Copy, Archive, Eye, CheckCircle } from "react-feather";
import { formatDate } from "../../Helper/Util";
import { ICard } from "../../Interfaces/Trello";
import Chips from "../Common/Chip";
import Dropdown from "../Dropdown/Dropdown";

import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";
import Avatar from "@mui/material/Avatar";

interface CardProps {
  card: ICard;
  boardId: number;
  removeCard: (boardId: number, cardId: number) => void;
  onDragEnd: (boardId: number, cardId: number) => void;
  onDragEnter: (boardId: number, cardId: number) => void;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
  copyCard: (boardId: number, cardId: number) => void;
  archiveCard: (boardId: number, cardId: number) => void;
  toggleWatch: (cardId: number) => void;
  selected: boolean;
  toggleSelect: () => void;
}

const avatarColors = ["#6C63FF", "#FF6584", "#00D2FF", "#4ECDC4", "#FFE66D", "#A66CFF"];

function Card(props: CardProps) {
  const { card, boardId, removeCard, onDragEnd, onDragEnter, updateCard, copyCard, archiveCard, toggleWatch, selected, toggleSelect } = props;
  const { id, title, description, date, tasks, labels, user, cover, watchers, archived } = card;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const completedTasks = tasks?.filter((item) => item.copleted)?.length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userColor = user?.[0]?.id ? avatarColors[user[0].id % avatarColors.length] : avatarColors[0];
  const userInitial = user?.[0]?.images?.charAt(0)?.toUpperCase() || "?";
  const isWatching = watchers?.includes(1);
  const hasCover = !!cover;

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.card-checkbox, .card-top-more, .dropdown')) return;
    setShowModal(true);
  };

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={card}
          boardId={boardId}
          updateCard={updateCard}
        />
      )}
      <div
        className={`card ${selected ? "card-selected" : ""} ${archived ? "card-archived" : ""} ${hasCover ? "has-cover" : ""}`}
        key={card.id}
        draggable
        onDragEnd={() => onDragEnd(boardId, id)}
        onDragEnter={() => onDragEnter(boardId, id)}
        onClick={handleClick}
      >
        {/* Cover */}
        {hasCover && <div className="card-cover" style={{ background: cover }} />}

        <div className="card-top">
          <div className="card-checkbox" onClick={e => { e.stopPropagation(); toggleSelect(); }}>
            <div className={`checkbox-custom ${selected ? "checked" : ""}`}>
              {selected && <CheckCircle size={14} />}
            </div>
          </div>
          <div className="card-top-labels">
            {labels?.map((item, index) => (
              <Chips key={index} item={item} />
            ))}
          </div>
          <div className="card-top-more" onClick={(event) => { event.stopPropagation(); setShowDropdown(true); }}>
            <MoreHorizontal size={16} />
            {showDropdown && (
              <Dropdown class="board-dropdown" onClose={() => setShowDropdown(false)}>
                <p onClick={() => { copyCard(boardId, id); setShowDropdown(false); }}>
                  <Copy size={14} /> Copier
                </p>
                <p onClick={() => { archiveCard(boardId, id); setShowDropdown(false); }}>
                  <Archive size={14} /> {archived ? "Restaurer" : "Archiver"}
                </p>
                <p onClick={() => { toggleWatch(id); setShowDropdown(false); }}>
                  <Eye size={14} /> {isWatching ? "Ne plus suivre" : "Suivre"}
                </p>
                <p onClick={() => { removeCard(boardId, id); setShowDropdown(false); }}>
                  <Trash size={14} /> Supprimer
                </p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card-title">{title}</div>
        {description && (
          <div className="card-desc">
            <AlignLeft size={14} />
            <span>{description}</span>
          </div>
        )}
        {totalTasks > 0 && (
          <div className="card-progress">
            <div className="card-progress-bar">
              <div className="card-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="card-progress-text">{progress}%</span>
          </div>
        )}
        <div className="card-footer">
          <div className="card-footer-left">
            {date && (
              <span className="card-footer-item card-footer-date">
                <Clock size={13} />
                {formatDate(date)}
              </span>
            )}
            {totalTasks > 0 && (
              <span className="card-footer-item">
                <CheckSquare size={13} />
                {completedTasks}/{totalTasks}
              </span>
            )}
            {isWatching && <span className="card-footer-item watching-badge"><Eye size={13} /></span>}
          </div>
          <div className="card-footer-right">
            {user && user.length > 0 && (
              <Avatar sx={{ width: 28, height: 28, bgcolor: userColor, fontSize: "0.75rem", fontWeight: 600 }}>
                {userInitial}
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Card;
