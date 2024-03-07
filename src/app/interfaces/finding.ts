import { FindingState } from "./finding-state";

export interface Finding {
  findingId: number;
  identifier: string;
  description: string;
  comment: string;
  findingStateId: number;
  image: string;
  projectId: number;
  date: Date;
  findingState: FindingState;
}
