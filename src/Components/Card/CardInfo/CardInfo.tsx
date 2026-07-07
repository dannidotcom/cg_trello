import React, { useEffect, useState } from "react";
import { Calendar, CheckSquare, List, Tag, Trash, Type, Users, MessageSquare, Activity, Image, Eye, X } from "react-feather";
import { colorsList } from "../../../Helper/Util";
import Modal from "../../Modal/Modal";
import CustomInput from "../../CustomInput/CustomInput";
import "./CardInfo.css";
import { ICard, ILabel, ITask, IComment, IActivity } from "../../../Interfaces/Trello";
import Chips from "../../Common/Chip";
import { mockUsersSimple } from "../../../ApiData/db";

interface CardInfoProps {
  onClose: () => void;
  card: ICard;
  boardId: number;
  updateCard: (boardId: number, cardId: number, card: ICard) => void;
}

const coverOptions = [
  { name: "Aucune", value: "" },
  { name: "Dégradé violet", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Dégradé rose", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Dégradé bleu", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Dégradé vert", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { name: "Dégradé orange", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Dégradé sombre", value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
];

function CardInfo(props: CardInfoProps) {
  const { onClose, card, boardId, updateCard } = props;
  const [selectedColor, setSelectedColor] = useState("");
  const [cardValues, setCardValues] = useState<ICard>({ ...card, comments: card.comments || [], activities: card.activities || [], watchers: card.watchers || [] });
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const [commentText, setCommentText] = useState("");
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  const currentUser = "Alphonse";

  const addActivity = (action: string) => {
    const act: IActivity = { id: Date.now(), action, author: currentUser, timestamp: new Date().toISOString() };
    setCardValues(prev => ({ ...prev, activities: [...(prev.activities || []), act] }));
  };

  const updateTitle = (value: string) => {
    setCardValues(prev => ({ ...prev, title: value }));
    addActivity(`a modifié le titre en "${value}"`);
  };

  const updateDesc = (value: string) => {
    setCardValues(prev => ({ ...prev, description: value }));
    addActivity("a modifié la description");
  };

  const addLabel = (label: ILabel) => {
    if (cardValues.labels.some(item => item.text === label.text)) return;
    if (!selectedColor) return;
    setSelectedColor("");
    setCardValues(prev => ({ ...prev, labels: [...prev.labels, { ...label, id: Date.now() }] }));
    addActivity(`a ajouté l'étiquette "${label.text}"`);
  };

  const removeLabel = (label: ILabel) => {
    setCardValues(prev => ({ ...prev, labels: prev.labels.filter(item => item.text !== label.text) }));
    addActivity(`a retiré l'étiquette "${label.text}"`);
  };

  const addTask = (value: string) => {
    const task: ITask = { id: Date.now() + Math.random() * 2, copleted: false, text: value };
    setCardValues(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
    addActivity(`a ajouté la tâche "${value}"`);
  };

  const removeTask = (id: number) => {
    setCardValues(prev => ({ ...prev, tasks: prev.tasks.filter(item => item.id !== id) }));
  };

  const assignUser = (userId: number) => {
    const selectedUser = mockUsersSimple.find(u => u.id === userId);
    if (!selectedUser) return;
    setCardValues(prev => ({ ...prev, user: [selectedUser] }));
    addActivity(`a assigné ${selectedUser.images}`);
  };

  const updateTask = (id: number, value: boolean) => {
    setCardValues(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, copleted: value } : t),
    }));
  };

  const calculatePercent = () => {
    if (!cardValues.tasks?.length) return 0;
    const completed = cardValues.tasks.filter(t => t.copleted)?.length;
    return Math.round((completed / cardValues.tasks.length) * 100);
  };

  const updateDate = (date: string) => {
    if (!date) return;
    setCardValues(prev => ({ ...prev, date }));
    addActivity(`a modifié la date au ${date}`);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const comment: IComment = { id: Date.now(), text: commentText, author: currentUser, createdAt: new Date().toISOString() };
    setCardValues(prev => ({ ...prev, comments: [...(prev.comments || []), comment] }));
    addActivity("a commenté");
    setCommentText("");
  };

  const setCover = (cover: string) => {
    setCardValues(prev => ({ ...prev, cover }));
    setShowCoverPicker(false);
    if (cover) addActivity("a changé la couverture");
  };

  const toggleWatch = () => {
    const userId = 1;
    setCardValues(prev => {
      const watching = prev.watchers || [];
      const idx = watching.indexOf(userId);
      const newWatchers = idx >= 0 ? watching.filter(w => w !== userId) : [...watching, userId];
      addActivity(idx >= 0 ? "ne suit plus cette carte" : "suit cette carte");
      return { ...prev, watchers: newWatchers };
    });
  };

  useEffect(() => {
    if (updateCard) updateCard(boardId, cardValues.id, cardValues);
  }, [cardValues, boardId, updateCard]);

  const calculatedPercent = calculatePercent();
  const [selectedUserId, setSelectedUserId] = useState<number>(cardValues.user?.[0]?.id || 0);
  const isWatching = cardValues.watchers?.includes(1);

  const formatDateTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">
        {/* Cover */}
        {cardValues.cover && (
          <div className="cardinfo-cover" style={{ background: cardValues.cover }}>
            {showCoverPicker && (
              <div className="cover-picker-overlay">
                <div className="cover-picker">
                  {coverOptions.map(o => (
                    <div key={o.name} className="cover-option" style={{ background: o.value || "var(--bg-card)" }} onClick={() => setCover(o.value)}>
                      {!o.value && <X size={16} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="cardinfo-tabs">
          <button className={`tab-btn ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>
            <List size={14} /> Détails
          </button>
          <button className={`tab-btn ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>
            <Activity size={14} /> Activité
          </button>
        </div>

        {activeTab === "details" ? (
          <>
            {/* Watchers + Cover actions */}
            <div className="cardinfo-actions-row">
              <button className={`cardinfo-action-btn ${isWatching ? "watching" : ""}`} onClick={toggleWatch}>
                <Eye size={15} /> {isWatching ? "✓ Suivi" : "Suivre"}
              </button>
              <button className="cardinfo-action-btn" onClick={() => setShowCoverPicker(!showCoverPicker)}>
                <Image size={15} /> Couverture
              </button>
              {showCoverPicker && (
                <div className="cover-picker-inline">
                  {coverOptions.map(o => (
                    <div key={o.name} className="cover-swatch" style={{ background: o.value || "var(--bg-card)", border: o.value === cardValues.cover ? "2px solid var(--accent-1)" : "2px solid transparent" }}
                      onClick={() => setCover(o.value)} title={o.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="cardinfo-box">
              <div className="cardinfo-box-title">
                <Type size={16} />
                <p>Titre</p>
              </div>
              <CustomInput defaultValue={cardValues.title} text={cardValues.title} placeholder="Entrez le titre" onSubmit={updateTitle} />
            </div>

            {/* Description */}
            <div className="cardinfo-box">
              <div className="cardinfo-box-title">
                <List size={16} />
                <p>Description</p>
              </div>
              <CustomInput defaultValue={cardValues.description} text={cardValues.description || "+ Ajouter une description"} placeholder="Entrez la description" onSubmit={updateDesc} />
            </div>

            {/* Date */}
            <div className="cardinfo-box">
              <div className="cardinfo-box-title">
                <Calendar size={16} />
                <p>Date d'échéance</p>
              </div>
              <div className="cardinfo-date-input">
                <input type="date" defaultValue={cardValues.date} onChange={(event) => updateDate(event.target.value)} />
              </div>
            </div>

            {/* Labels */}
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
                    <li key={index} style={{ backgroundColor: item }}
                      className={selectedColor === item ? "li-active" : ""}
                      onClick={() => setSelectedColor(item)} />
                  ))}
                </ul>
                <CustomInput text="+ Étiquette" placeholder="Nom de l'étiquette"
                  onSubmit={(value: string) => addLabel({ color: selectedColor, text: value, cartes_id: cardValues.id })} />
              </div>
            </div>

            {/* Assign */}
            <div className="cardinfo-box">
              <div className="cardinfo-box-title">
                <Users size={16} />
                <p>Assigner à</p>
              </div>
              <select className="cardinfo-user-select" value={selectedUserId} onChange={e => { const id = parseInt(e.target.value); setSelectedUserId(id); assignUser(id); }}>
                <option value={0}>Non assigné</option>
                {mockUsersSimple.map(u => <option key={u.id} value={u.id}>{u.images}</option>)}
              </select>
            </div>

            {/* Checklist */}
            <div className="cardinfo-box">
              <div className="cardinfo-box-title">
                <CheckSquare size={16} />
                <p>Checklist</p>
                <span className="cardinfo-percent">{calculatedPercent}%</span>
              </div>
              <div className="cardinfo-box-progress-bar">
                <div className="cardinfo-box-progress" style={{ width: `${calculatedPercent}%`, backgroundColor: calculatedPercent === 100 ? "var(--success)" : "" }} />
              </div>
              <div className="cardinfo-box-task-list">
                {cardValues.tasks?.map((item) => (
                  <div key={item.id} className="cardinfo-box-task-checkbox">
                    <label className="cardinfo-task-label">
                      <input type="checkbox" defaultChecked={item.copleted} onChange={(event) => updateTask(item.id, event.target.checked)} />
                      <span className={item.copleted ? "completed" : ""}>{item.text}</span>
                    </label>
                    <Trash size={14} onClick={() => removeTask(item.id)} className="task-delete" />
                  </div>
                ))}
              </div>
              <CustomInput text="+ Tâche" placeholder="Saisir la tâche" onSubmit={addTask} />
            </div>

            {/* Comments */}
            <div className="cardinfo-box">
              <div className="cardinfo-box-title">
                <MessageSquare size={16} />
                <p>Commentaires</p>
              </div>
              <div className="comments-list">
                {(cardValues.comments || []).length === 0 ? (
                  <div className="comments-empty">Aucun commentaire</div>
                ) : (
                  cardValues.comments?.map(c => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-avatar">{c.author.charAt(0).toUpperCase()}</div>
                      <div className="comment-body">
                        <div className="comment-header">
                          <strong>{c.author}</strong>
                          <span>{formatDateTime(c.createdAt)}</span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="comment-form">
                <textarea
                  placeholder="Écrire un commentaire..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                />
                <button className="comment-submit" onClick={addComment} disabled={!commentText.trim()}>Envoyer</button>
              </div>
            </div>
          </>
        ) : (
          /* Activity Tab */
          <div className="cardinfo-box">
            <div className="cardinfo-box-title">
              <Activity size={16} />
              <p>Activité</p>
            </div>
            <div className="activity-list">
              {(cardValues.activities || []).length === 0 ? (
                <div className="activity-empty">Aucune activité</div>
              ) : (
                [...(cardValues.activities || [])].reverse().map(a => (
                  <div key={a.id} className="activity-item">
                    <div className="activity-avatar">{a.author.charAt(0).toUpperCase()}</div>
                    <div className="activity-body">
                      <strong>{a.author}</strong> {a.action}
                      <div className="activity-time">{formatDateTime(a.timestamp)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
export default CardInfo;
