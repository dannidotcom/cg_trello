import { mockBoards } from "../ApiData/db";
import { IBoard } from "../Interfaces/Trello";

const LocalStorageKeyName = "data";

export class BoardAPI {
  async fetchBoardList(): Promise<IBoard[]> {
    let BoardList: IBoard[] = [];

    if (localStorage.getItem(LocalStorageKeyName)) {
      const localStorageData: IBoard[] = JSON.parse(
        localStorage.getItem(LocalStorageKeyName) ?? "",
      );
      BoardList = [...localStorageData];
    } else {
      BoardList = JSON.parse(JSON.stringify(mockBoards));
      updateLocalStorageBoards(BoardList);
    }

    return BoardList;
  }
}

export async function fetchBoardList(): Promise<IBoard[]> {
  const api = new BoardAPI();
  return api.fetchBoardList();
}

export function updateLocalStorageBoards(boards: IBoard[]) {
  localStorage.setItem(LocalStorageKeyName, JSON.stringify(boards));
}
