export interface ILabel {
  id?:number;
  color: string;
  text: string;
  cartes_id: number;
}

export interface ITask {
  id: number;
  copleted: boolean;
  text: string;
}
 
export interface ICard {
  id: number;
  title: string;
  labels: ILabel[];
  date: string;
  tasks: ITask[];
  description?: string;
  user: IUser[]
}

export interface IBoard {
  id: number;
  nom: string;
  carte: ICard[];
}
 
export interface IUser {
  id: number;
  images: string;
  
}
