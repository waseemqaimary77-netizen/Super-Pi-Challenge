export interface Result {
  id?: string;
  name: string;
  correctDigits: number;
  wrongCount?: number;
  accuracy: number;
  time: number;
  type: 'practice' | 'super';
  createdAt: Date | any;
}

export interface ContestState {
  isStarted: boolean;
  isFinished: boolean;
  startTime: number | null;
  endTime: number | null;
  input: string;
  type: 'practice' | 'super';
}
