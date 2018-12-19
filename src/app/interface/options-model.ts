export interface OptiopnsModel {
  unit: string;
  step: number;
  showInput: boolean;
  min?: number;
  max?: number;
  data: Array<{
    count: number;
    width: number;
    hoverText?: string;
  }>;
}
