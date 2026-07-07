export interface ILabel {
  id?: number;
  color: string;
  text: string;
  cartes_id: number;
}

export interface ITask {
  id: number;
  copleted: boolean;
  text: string;
}

export interface IComment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

export interface IActivity {
  id: number;
  action: string;
  author: string;
  timestamp: string;
  details?: string;
}

export interface ICard {
  id: number;
  title: string;
  labels: ILabel[];
  date: string;
  tasks: ITask[];
  description?: string;
  user: IUser[];
  comments?: IComment[];
  activities?: IActivity[];
  cover?: string;
  watchers?: number[];
  archived?: boolean;
}

export interface IBoard {
  id: number;
  nom: string;
  carte: ICard[];
  color?: string;
  archived?: boolean;
  favorite?: boolean;
}

export interface IUser {
  id: number;
  images: string;
}

export interface IBoardTemplate {
  id: number;
  name: string;
  description: string;
  icon: string;
  boards: { nom: string; cards: { title: string; labels?: string[] }[] }[];
}
