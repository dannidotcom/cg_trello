import React, { useEffect, useState, useRef } from "react";
import Board from "../Components/Board/Board";
import "./Dashboard.css";
import CustomInput from "../Components/CustomInput/CustomInput";
import { ICard, IBoard, IBoardTemplate } from "../Interfaces/Trello";
import { fetchBoardList, updateLocalStorageBoards } from "../Helper/ApiData";
import { boardTemplates, labelPresets } from "../ApiData/db";
import { Search, Calendar, Grid, List, Sun, Moon, Archive, Plus, X } from "react-feather";

type ViewMode = "kanban" | "calendar" | "table";

interface Notification {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
  time: number;
}

let notifId = 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let notifications: Notification[] = [];
let setNotifs: React.Dispatch<React.SetStateAction<Notification[]>> = () => {};

export function notify(message: string, type: "success" | "info" | "warning" = "info") {
  const id = ++notifId;
  setNotifs(prev => [...prev, { id, message, type, time: Date.now() }]);
  setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 3000);
}

function Dashboard() {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMember, setFilterMember] = useState<number>(0);
  const [filterLabel, setFilterLabel] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState<Notification[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [userMenu, setUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  setNotifs = setNotifList;
  const currentUser = { id: 1, name: "Alphonse" };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { updateLocalStorageBoards(boards); }, [boards]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function fetchData() {
    const data = await fetchBoardList();
    setBoards(data);
  }

  const [targetCard, setTargetCard] = useState({ boardId: 0, cardId: 0 });

  const activeBoards = boards.filter(b => !b.archived);
  const archivedBoards = boards.filter(b => b.archived);

  const filteredBoards = activeBoards.filter(b => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCard = b.carte.some(c =>
        c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
      );
      if (!b.nom.toLowerCase().includes(q) && !matchCard) return false;
    }
    if (filterMember > 0) {
      if (!b.carte.some(c => c.user?.some(u => u.id === filterMember))) return false;
    }
    if (filterLabel) {
      if (!b.carte.some(c => c.labels?.some(l => l.text === filterLabel))) return false;
    }
    return true;
  });

  const addboardHandler = (name: string) => {
    const nb: IBoard = { id: Date.now(), nom: name, carte: [] };
    setBoards(prev => [...prev, nb]);
    notify(`Liste "${name}" créée`, "success");
  };

  const removeBoard = (boardId: number) => {
    setBoards(prev => prev.filter(b => b.id !== boardId));
    notify("Liste supprimée", "warning");
  };

  const renameBoard = (boardId: number, name: string) => {
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, nom: name } : b));
  };

  const toggleFavorite = (boardId: number) => {
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, favorite: !b.favorite } : b));
  };

  const archiveBoard = (boardId: number) => {
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, archived: true } : b));
    notify("Liste archivée", "info");
  };

  const restoreBoard = (boardId: number) => {
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, archived: false } : b));
    notify("Liste restaurée", "success");
  };

  const reorderBoards = (fromIndex: number, toIndex: number) => {
    const list = [...activeBoards];
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    const archived = boards.filter(b => b.archived);
    setBoards([...list, ...archived]);
  };

  const applyTemplate = (template: IBoardTemplate) => {
    const newBoards: IBoard[] = template.boards.map((b, bi) => ({
      id: Date.now() + bi,
      nom: b.nom,
      carte: b.cards.map((c, ci) => ({
        id: Date.now() + bi * 100 + ci,
        title: c.title,
        labels: (c.labels || []).map((l, li) => ({
          id: Date.now() + li, color: labelPresets.find(p => p.text === l)?.color || "#888", text: l, cartes_id: Date.now() + bi * 100 + ci,
        })),
        date: "", tasks: [], user: [], description: "", comments: [], activities: [], watchers: [],
      })),
      color: undefined, archived: false, favorite: false,
    }));
    setBoards(prev => [...prev, ...newBoards]);
    setShowTemplates(false);
    notify(`Tableau "${template.name}" créé`, "success");
  };

  const addCardHandler = (tableau_id: number, title: string) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== tableau_id) return b;
      const newCard: ICard = {
        id: Date.now(), title, labels: [], date: "", tasks: [], user: [], description: "",
        comments: [], activities: [{ id: Date.now(), action: "a créé la carte", author: currentUser.name, timestamp: new Date().toISOString() }], watchers: [currentUser.id],
      };
      return { ...b, carte: [...b.carte, newCard] };
    }));
  };

  const removeCard = (boardId: number, cardId: number) => {
    setBoards(prev => prev.map(b =>
      b.id === boardId ? { ...b, carte: b.carte.filter(c => c.id !== cardId) } : b
    ));
  };

  const copyCard = (boardId: number, cardId: number) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      const card = b.carte.find(c => c.id === cardId);
      if (!card) return b;
      const newCard: ICard = { ...card, id: Date.now(), title: card.title + " (copie)" };
      return { ...b, carte: [...b.carte, newCard] };
    }));
    notify("Carte copiée", "success");
  };

  const archiveCard = (boardId: number, cardId: number) => {
    setBoards(prev => prev.map(b =>
      b.id === boardId ? { ...b, carte: b.carte.map(c => c.id === cardId ? { ...c, archived: !c.archived } : c) } : b
    ));
  };

  const updateCard = (boardId: number, cardId: number, card: ICard) => {
    setBoards(prev => prev.map(b => {
      if (b.id !== boardId) return b;
      const cards = b.carte.map(c => c.id === cardId ? { ...card, activities: addActivity(card.activities || [], `${currentUser.name} a modifié la carte`) } : c);
      return { ...b, carte: cards };
    }));
  };

  const addActivity = (activities: any[], action: string) => {
    return [...activities, { id: Date.now(), action, author: currentUser.name, timestamp: new Date().toISOString() }];
  };

  const onDragEnd = (boardId: number, cardId: number) => {
    const sourceBoardIndex = boards.findIndex(b => b.id === boardId);
    if (sourceBoardIndex < 0) return;
    const sourceCardIndex = boards[sourceBoardIndex]?.carte?.findIndex(c => c.id === cardId);
    if (sourceCardIndex < 0) return;
    const targetBoardIndex = boards.findIndex(b => b.id === targetCard.boardId);
    if (targetBoardIndex < 0) return;
    const targetCardIndex = boards[targetBoardIndex]?.carte?.findIndex(c => c.id === targetCard.cardId);
    if (targetCardIndex < 0) return;
    const temp = [...boards];
    const sourceCard = temp[sourceBoardIndex].carte[sourceCardIndex];
    temp[sourceBoardIndex].carte.splice(sourceCardIndex, 1);
    temp[targetBoardIndex].carte.splice(targetCardIndex, 0, sourceCard);
    setBoards(temp);
    setTargetCard({ boardId: 0, cardId: 0 });
  };

  const onDragEnter = (boardId: number, cardId: number) => {
    if (targetCard.cardId === cardId) return;
    setTargetCard({ boardId, cardId });
  };

  const handleBoardDragStart = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData("boardIndex", String(index));
  };

  const handleBoardDrop = (toIndex: number) => (e: React.DragEvent) => {
    const fromIndex = parseInt(e.dataTransfer.getData("boardIndex"));
    if (fromIndex !== toIndex) reorderBoards(fromIndex, toIndex);
  };

  const toggleSelectCard = (cardId: number) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      next.has(cardId) ? next.delete(cardId) : next.add(cardId);
      return next;
    });
  };

  const batchDelete = () => {
    setBoards(prev => prev.map(b => ({ ...b, carte: b.carte.filter(c => !selectedCards.has(c.id)) })));
    setSelectedCards(new Set());
    notify(`${selectedCards.size} carte(s) supprimée(s)`, "warning");
  };

  const batchMove = (targetBoardId: number) => {
    setBoards(prev => prev.map(b => {
      const toMove = b.carte.filter(c => selectedCards.has(c.id));
      if (toMove.length === 0) return b;
      if (b.id === targetBoardId) return { ...b, carte: [...b.carte] };
      return { ...b, carte: b.carte.filter(c => !selectedCards.has(c.id)) };
    }));
    setBoards(prev => prev.map(b => {
      if (b.id !== targetBoardId) return b;
      const moved = prev.flatMap(p => p.carte.filter(c => selectedCards.has(c.id)));
      return { ...b, carte: [...b.carte, ...moved] };
    }));
    setSelectedCards(new Set());
    notify("Cartes déplacées", "success");
  };

  const toggleWatch = (cardId: number) => {
    setBoards(prev => prev.map(b => ({
      ...b, carte: b.carte.map(c => {
        if (c.id !== cardId) return c;
        const watching = c.watchers || [];
        const idx = watching.indexOf(currentUser.id);
        return { ...c, watchers: idx >= 0 ? watching.filter(w => w !== currentUser.id) : [...watching, currentUser.id] };
      })
    })));
  };

  const today = new Date();
  const calendarDates: { date: Date; cards: ICard[] }[] = [];
  for (let i = -3; i < 14; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const cards = activeBoards.flatMap(b => b.carte.filter(c => {
      if (!c.date) return false;
      const cd = new Date(c.date);
      return cd.toDateString() === d.toDateString();
    }));
    calendarDates.push({ date: d, cards });
  }

  const allLabels = Array.from(new Set(activeBoards.flatMap(b => b.carte.flatMap(c => c.labels?.map(l => l.text) || []))));

  const navItems: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "kanban", icon: <Grid size={18} />, label: "Kanban" },
    { mode: "calendar", icon: <Calendar size={18} />, label: "Calendrier" },
    { mode: "table", icon: <List size={18} />, label: "Tableau" },
  ];

  return (
    <div className="app">
      {/* Notification Container */}
      <div className="notification-container">
        {notifList.map(n => (
          <div key={n.id} className={`notification-toast notification-${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">◆</span>
            {!sidebarCollapsed && <h1 className="sidebar-logo-text">CG Trello</h1>}
          </div>
          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <ChevronLeftIcon />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">{!sidebarCollapsed && "Navigation"}</div>
          {navItems.map(item => (
            <button
              key={item.mode}
              className={`sidebar-nav-item ${viewMode === item.mode ? "active" : ""}`}
              onClick={() => setViewMode(item.mode)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="sidebar-nav-label">{item.label}</span>}
              {viewMode === item.mode && <span className="sidebar-nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-nav">
          <div className="sidebar-section-label">{!sidebarCollapsed && "Outils"}</div>
          <button
            className="sidebar-nav-item sidebar-ai-btn"
            onClick={() => notify("Assistant IA bientôt disponible !", "info")}
            title={sidebarCollapsed ? "Assistant IA" : undefined}
          >
            <span className="sidebar-nav-icon"><SparkleIcon /></span>
            {!sidebarCollapsed && <span className="sidebar-nav-label">Assistant IA</span>}
            {!sidebarCollapsed && <span className="sidebar-ai-badge">Bientôt</span>}
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => setShowTemplates(true)}
            title={sidebarCollapsed ? "Templates" : undefined}
          >
            <span className="sidebar-nav-icon"><Plus size={18} /></span>
            {!sidebarCollapsed && <span className="sidebar-nav-label">Templates</span>}
          </button>
          <button
            className={`sidebar-nav-item ${showArchived ? "active" : ""}`}
            onClick={() => setShowArchived(!showArchived)}
            title={sidebarCollapsed ? "Archivés" : undefined}
          >
            <span className="sidebar-nav-icon"><Archive size={18} /></span>
            {!sidebarCollapsed && <span className="sidebar-nav-label">Archivés</span>}
            {archivedBoards.length > 0 && (
              <span className="sidebar-badge">{archivedBoards.length}</span>
            )}
          </button>
        </div>

        <div className="sidebar-spacer" />

        <div className="sidebar-footer">
          <button
            className="sidebar-theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Changer le thème"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!sidebarCollapsed && <span>{darkMode ? "Sombre" : "Clair"}</span>}
          </button>
          <div className="sidebar-user" onClick={() => setUserMenu(!userMenu)}>
            <div className="sidebar-user-avatar">A</div>
            {!sidebarCollapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">Alphonse</span>
                <span className="sidebar-user-role">Admin</span>
              </div>
            )}
            {userMenu && (
              <div className="sidebar-user-dropdown">
                <div className="sidebar-user-dropdown-item" onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
                  <LogoutIcon /> Déconnexion
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className={`main-area ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-search">
              <Search size={16} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Rechercher des cartes... (Ctrl+K)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && <X size={14} className="topbar-search-clear" onClick={() => setSearchQuery("")} />}
            </div>
          </div>
          <div className="topbar-right">
            {(filterMember !== 0 || filterLabel) && (
              <div className="topbar-active-filters">
                <span className="topbar-filters-label">Filtres actifs</span>
                <button className="topbar-clear-filters" onClick={() => { setFilterMember(0); setFilterLabel(""); }}>
                  <X size={12} /> Effacer
                </button>
              </div>
            )}
            {viewMode === "kanban" && (
              <>
                <select className="topbar-select" value={filterMember} onChange={e => setFilterMember(Number(e.target.value))}>
                  <option value={0}>Tous les membres</option>
                  {Array.from(new Set(activeBoards.flatMap(b => b.carte.flatMap(c => c.user || [])))).map(u => (
                    <option key={u.id} value={u.id}>{u.images}</option>
                  ))}
                </select>
                <select className="topbar-select" value={filterLabel} onChange={e => setFilterLabel(e.target.value)}>
                  <option value="">Toutes les étiquettes</option>
                  {allLabels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </>
            )}
            {selectedCards.size > 0 && (
              <div className="topbar-batch">
                <span className="topbar-batch-count">{selectedCards.size}</span>
                <select className="topbar-select" onChange={e => { if (e.target.value) batchMove(Number(e.target.value)); e.target.value = ""; }}>
                  <option value="">Déplacer</option>
                  {activeBoards.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
                </select>
                <button className="topbar-batch-delete" onClick={batchDelete} title="Supprimer">
                  <TrashIcon />
                </button>
                <button className="topbar-batch-clear" onClick={() => setSelectedCards(new Set())}>X</button>
              </div>
            )}
            <button className="topbar-icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
              <div className="topbar-notif-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {notifList.length > 0 && <span className="topbar-notif-badge">{notifList.length}</span>}
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="content-area">
          {/* Kanban */}
          {viewMode === "kanban" && (
            <>
              {filteredBoards.length === 0 && !searchQuery && !filterMember && !filterLabel ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>Bienvenue sur CG Trello</h3>
                  <p>Créez votre première liste ou utilisez un template pour démarrer rapidement.</p>
                  <button className="btn-primary" onClick={() => setShowTemplates(true)}>
                    <Plus size={16} /> Créer un tableau
                  </button>
                </div>
              ) : (
                <div className="boards-scroll">
                  <div className="boards-inner">
                    {filteredBoards.map((item, index) => (
                      <div key={item.id} className="board-wrapper"
                        draggable
                        onDragStart={handleBoardDragStart(index)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleBoardDrop(index)}
                      >
                        <Board
                          board={item}
                          addCard={addCardHandler}
                          removeBoard={() => removeBoard(item.id)}
                          removeCard={removeCard}
                          onDragEnd={onDragEnd}
                          onDragEnter={onDragEnter}
                          updateCard={updateCard}
                          renameBoard={renameBoard}
                          toggleFavorite={toggleFavorite}
                          archiveBoard={archiveBoard}
                          copyCard={copyCard}
                          archiveCard={archiveCard}
                          toggleWatch={toggleWatch}
                          selectedCards={selectedCards}
                          toggleSelectCard={toggleSelectCard}
                        />
                      </div>
                    ))}
                    <div className="app-boards-last">
                      <CustomInput
                        displayClass="app-boards-add-board"
                        editClass="app-boards-add-board-edit"
                        placeholder="Entrez le nom de la liste"
                        text="+ Ajouter une liste"
                        buttonText="Ajouter"
                        onSubmit={addboardHandler}
                      />
                    </div>
                  </div>
                </div>
              )}
              {showArchived && archivedBoards.length > 0 && (
                <div className="archived-section">
                  <h4>Listes archivées</h4>
                  <div className="archived-boards">
                    {archivedBoards.map(b => (
                      <div key={b.id} className="archived-board-card">
                        <span>{b.nom}</span>
                        <button onClick={() => restoreBoard(b.id)}>Restaurer</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="calendar-view">
              <div className="calendar-header">
                <h3>Calendrier</h3>
              </div>
              <div className="calendar-grid">
                {calendarDates.map(({ date, cards }) => (
                  <div key={date.toISOString()} className={`calendar-day ${date.toDateString() === today.toDateString() ? 'today' : ''}`}>
                    <div className="calendar-day-header">
                      <span className="calendar-day-name">{date.toLocaleDateString("fr-FR", { weekday: "short" })}</span>
                      <span className="calendar-day-number">{date.getDate()}</span>
                    </div>
                    <div className="calendar-cards">
                      {cards.map(c => (
                        <div key={c.id} className="calendar-card" style={{ borderLeftColor: c.labels?.[0]?.color || "var(--accent-1)" }}>
                          {c.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="table-view">
              <div className="table-view-header">
                <h3>Vue Tableau</h3>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Titre</th>
                      <th>Liste</th>
                      <th>Membre</th>
                      <th>Étiquettes</th>
                      <th>Date</th>
                      <th>Tâches</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBoards.flatMap(b =>
                      b.carte.map(c => (
                        <tr key={c.id} className={selectedCards.has(c.id) ? "selected" : ""} onClick={() => toggleSelectCard(c.id)}>
                          <td><input type="checkbox" checked={selectedCards.has(c.id)} readOnly /></td>
                          <td><strong>{c.title}</strong></td>
                          <td><span className="table-board-badge" style={{ background: b.color || "var(--accent-1)" }}>{b.nom}</span></td>
                          <td>{c.user?.[0]?.images || "—"}</td>
                          <td>
                            <div className="table-labels">
                              {c.labels?.map((l, i) => <span key={i} className="mini-label" style={{ background: l.color }}>{l.text}</span>)}
                            </div>
                          </td>
                          <td>{c.date || "—"}</td>
                          <td>{c.tasks?.filter((t: any) => t.copleted).length}/{c.tasks?.length || 0}</td>
                          <td className="table-desc">{c.description || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="modal-content template-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Créer un tableau</h3>
              <button className="modal-close" onClick={() => setShowTemplates(false)}><X size={18} /></button>
            </div>
            <div className="templates-list">
              <div className="template-card create-blank" onClick={() => {
                addboardHandler("Nouveau tableau");
                setShowTemplates(false);
              }}>
                <div className="template-icon">+</div>
                <strong>Tableau vierge</strong>
                <span>Créer un tableau vide</span>
              </div>
              {boardTemplates.map(t => (
                <div key={t.id} className="template-card" onClick={() => applyTemplate(t)}>
                  <div className="template-icon">{t.icon}</div>
                  <strong>{t.name}</strong>
                  <span>{t.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      {showNotifications && (
        <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notif-panel" onClick={e => e.stopPropagation()}>
            <div className="notif-panel-header">
              <h4>Notifications</h4>
              <button onClick={() => setShowNotifications(false)}><X size={16} /></button>
            </div>
            <div className="notif-panel-body">
              {notifList.length === 0 ? (
                <div className="notif-empty">Aucune notification</div>
              ) : (
                notifList.map(n => (
                  <div key={n.id} className={`notif-item notif-${n.type}`}>{n.message}</div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}

function TrashIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}

function ChevronLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>;
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/>
      <path d="M18 14l.7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7z"/>
    </svg>
  );
}

export default Dashboard;
