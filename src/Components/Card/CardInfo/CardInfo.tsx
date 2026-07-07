import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Trash, Type, Users } from "react-feather";
import { colorsList } from "../../../Helper/Util";
import Modal from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";
import "./CardInfo.css";
import { ICard, ILabel, ITask } from "../../../Interfaces/Trello";
import Chips from "../../Common/Chip";
import { mockUsersSimple } from "../../../ApiData/db";

interface CardInfoProps {
  onClose: () => void;
  card: ICard;
  boardId: number;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
}

const avatarColors = ["#6C63FF", "#FF6584", "#00D2FF", "#4ECDC4", "#FFE66D", "#A66CFF"];

function CardInfo(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard } = props;
  const [selectedColor, setSelectedColor] = useState("");
  const [cardValues, setCardValues] = useState<ICard>({ ...card });

  const updateTitle = (value: string) => {
    setCardValues({ ...cardValues, title: value });
  };

  const updateDesc = (value: string) => {
    setCardValues({ ...cardValues, description: value });
  };

  const addLabel = (label: ILabel) => {
    const index = cardValues.labels.findIndex(
      (item) => item.text === label.text,
    );
    if (index > -1) return;
    setSelectedColor("");
    setCardValues({
      ...cardValues,
      labels: [...cardValues.labels, { ...label, id: Date.now() }],
    });
  };

  const removeLabel = (label: ILabel) => {
    const tempLabels = cardValues.labels.filter(
      (item) => item.text !== label.text,
    );
    setCardValues({
      ...cardValues,
      labels: tempLabels,
    });
  };

  const addTask = (value: string) => {
    const task: ITask = {
      id: Date.now() + Math.random() * 2,
      copleted: false,
      text: value,
    };
    setCardValues({
      ...cardValues,
      tasks: [...cardValues.tasks, task],
    });
  };

  const removeTask = (id: number) => {
    const tasks = [...cardValues.tasks];
    const tempTasks = tasks.filter((item) => item.id !== id);
    setCardValues({
      ...cardValues,
      tasks: tempTasks,
    });
  };

  const assignUser = (userId: number) => {
    const selectedUser = mockUsersSimple.find(u => u.id === userId);
    if (!selectedUser) return;
    setCardValues({
      ...cardValues,
      user: [selectedUser],
    });
  };

  const updateTask = (id: number, value: boolean) => {
    const tasks = [...cardValues.tasks];
    const index = tasks.findIndex((item) => item.id === id);
    if (index < 0) return;
    tasks[index].copleted = Boolean(value);
    setCardValues({
      ...cardValues,
      tasks,
    });
  };

  const calculatePercent = () => {
    if (!cardValues.tasks?.length) return 0;
    const completed = cardValues.tasks?.filter(
      (item) => item.copleted,
    )?.length;
    return Math.round((completed / cardValues.tasks?.length) * 100);
  };

  const updateDate = (date: string) => {
    if (!date) return;
    setCardValues({
      ...cardValues,
      date,
    });
  };

  useEffect(() => {
    if (updateCard) updateCard(boardId, cardValues.id, cardValues);
  }, [cardValues]);

  const calculatedPercent = calculatePercent();
  const [selectedUserId, setSelectedUserId] = useState<number>(
    cardValues.user?.[0]?.id || 0
  );

  const handleAssignUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setSelectedUserId(id);
    assignUser(id);
  };

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">
        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Type size={16} />
            <p>Titre</p>
          </div>
          <CustomInput
            defaultValue={cardValues.title}
            text={cardValues.title}
            placeholder="Entrez le titre"
            onSubmit={updateTitle}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <List size={16} />
            <p>Description</p>
          </div>
          <CustomInput
            defaultValue={cardValues.description}
            text={cardValues.description || "+ Ajouter une description"}
            placeholder="Entrez la description"
            onSubmit={updateDesc}
          />
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Calendar size={16} />
            <p>Date d'échéance</p>
          </div>
          <div className="cardinfo-date-input">
            <input
              type="date"
              defaultValue={cardValues.date}
              onChange={(event) => updateDate(event.target.value)}
            />
          </div>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Tag size={16} />
            <p>Étiquettes</p>
          </div>
          <div className="cardinfo-box-labels">
            {cardValues.labels?.map((item, index) => (
              <Chips key={index} item={item} removeLabel={removeLabel} />
            ))}
          </div>
          <div className="cardinfo-label-picker">
            <ul>
              {colorsList.map((item, index) => (
                <li
                  key={index}
                  style={{ backgroundColor: item }}
                  className={selectedColor === item ? "li-active" : ""}
                  onClick={() => setSelectedColor(item)}
                />
              ))}
            </ul>
            <CustomInput
              text="+ Étiquette"
              placeholder="Nom de l'étiquette"
              onSubmit={(value: string) =>
                addLabel({ color: selectedColor, text: value, cartes_id: cardValues.id })
              }
            />
          </div>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <Users size={16} />
            <p>Assigner à</p>
          </div>
          <select
            className="cardinfo-user-select"
            value={selectedUserId}
            onChange={handleAssignUser}
          >
            <option value={0}>Non assigné</option>
            {mockUsersSimple.map((u) => (
              <option key={u.id} value={u.id}>
                {u.images}
              </option>
            ))}
          </select>
        </div>

        <div className="cardinfo-box">
          <div className="cardinfo-box-title">
            <CheckSquare size={16} />
            <p>Checklist</p>
            <span className="cardinfo-percent">{calculatedPercent}%</span>
          </div>
          <div className="cardinfo-box-progress-bar">
            <div
              className="cardinfo-box-progress"
              style={{
                width: `${calculatedPercent}%`,
                backgroundColor: calculatedPercent === 100 ? "var(--success)" : "",
              }}
            />
          </div>

          <div className="cardinfo-box-task-list">
            {cardValues.tasks?.map((item) => (
              <div key={item.id} className="cardinfo-box-task-checkbox">
                <label className="cardinfo-task-label">
                  <input
                    type="checkbox"
                    defaultChecked={item.copleted}
                    onChange={(event) =>
                      updateTask(item.id, event.target.checked)
                    }
                  />
                  <span className={item.copleted ? "completed" : ""}>{item.text}</span>
                </label>
                <Trash size={14} onClick={() => removeTask(item.id)} className="task-delete" />
              </div>
            ))}
          </div>
          <CustomInput
            text="+ Tâche"
            placeholder="Saisir la tâche"
            onSubmit={addTask}
          />
        </div>
      </div>
    </Modal>
  );
}
export default CardInfo;
