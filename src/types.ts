export interface Result {
  id?: string;
  name: string;
  correctDigits: number;
  accuracy: number;
  time: number;
  createdAt: Date | any;
}

export interface ContestState {
  isStarted: boolean;
  isFinished: boolean;
  startTime: number | null;
  endTime: number | null;
  input: string;
}
