export interface OptionsDataModel {
  count: number; // 当前段的数值
  width: number; // 当前段所占比例 0~100 总和应为100
}

export interface OptiopnsModel {
  unit: string; // 单位
  step: number;
  showInput: boolean; // 是否显示input
  min?: number; // 最小值
  max?: number; // 最大值
  data: OptionsDataModel[];
}
