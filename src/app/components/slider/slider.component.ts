import { Component, Input, OnInit, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { DataModel } from '../../interface/options-model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true,
  }],
})
export class SliderComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() min = 0;
  @Input() max: number;
  @Input() unit: string; // 单位
  @Input() step: number;
  @Input() showInput: boolean; // 是否显示input

  @Input() set data(value: DataModel[]) {
    this.$data = value;
    this.init();
  }
  get data() {
    return this.$data;
  }

  left = 0;
  value = 0;
  unmove = true;
  setViewValue: (value: number) => void;
  disabled = false;
  dragEl: Element;
  prevEl: Element;
  prevElWidth: number;
  $data: DataModel[];

  constructor(private ref: ElementRef) {}

  ngOnInit() {
    this.dragEl = this.ref.nativeElement.getElementsByClassName('slider-drag')[0]; // 获取滑块的dom元素
    this.prevEl = this.ref.nativeElement.getElementsByClassName('bk')[0]; // 获取滑动条的dom元素

    window.onresize = () => { // 避免窗口变化时样式错乱
      this.prevElWidth = this.prevEl.clientWidth - this.dragEl.clientWidth; // 获取滑动条总长
      this.left = this.valueToLeft(this.value);
    };
    this.init();
  }

  ngOnDestroy() {
    window.onresize = window.onmousemove = window.onmouseup = null;
  }

  init() {
    this.data.sort((x, y) => x.count - y.count);
    this.max = this.max == null ? this.data[this.data.length - 1].count : this.max;
    setTimeout(window.onresize); // 组件刚加载完样式有误差 需要重新计算样式
  }

  down(e) {
    this.unmove = false;
    const x = e.clientX;
    const left = this.left;

    window.onmousemove = ev => {
      const _x = ev.clientX - x + left;
      this.left = Math.min(Math.max(_x, 0), this.prevElWidth);
      this.value = this.leftToValue(this.left);
    };

    window.onmouseup = () => {
      this.unmove = true;
      window.onmousemove = window.onmouseup = null;
      this.left = this.valueToLeft(this.value);
    };
  }

  findIndex(w): {index: number, beforeWidth: number} { // 滑动时找到当前处于哪个阶段
    let width = 0;

    for (let index = 0; index < this.data.length; index++) {
      width += this.data[index].width;
     if (width >= w) {
       return {
         index,
         beforeWidth: width - this.data[index].width,
       };
     }
    }
  }

  leftToValue(left): number { // 根据滑块位置获取值
    const _left = left * 100 / this.prevElWidth;
    const { index, beforeWidth } = this.findIndex(_left);
    const data = this.data[index];

    let value;
    if (index) {
      value = this.data[index - 1].count + (data.count - this.data[index - 1].count) * (_left - beforeWidth) / data.width;
    } else {
      value = data.count * _left / data.width;
    }
    value = Math.round(value / this.step) * this.step;
    this.setViewValue(value);
    return value;
  }

  valueToLeft(value): number {  // 根据值来获取滑块位置
    let width = 0;
    for (let index = 0; index < this.data.length; index++) {
      if (this.data[index].count >= value) {
        if (index) {
          return ((value - this.data[index - 1].count) / (this.data[index].count - this.data[index - 1].count) * this.data[index].width + width) * this.prevElWidth / 100;
        } else {
          return this.prevElWidth * this.data[0].width / 100 * value / this.data[0].count;
        }
      }
      width += this.data[index].width;
    }
  }

  changeValue() {
    this.value = Math.min(this.max, Math.max(this.min, this.value));
    this.left = this.valueToLeft(this.value);
    this.setViewValue(this.value);
  }

  clickSlider(e) {
    const left = e.clientX - e.currentTarget.offsetLeft - this.dragEl.clientWidth / 2;

    if (left > this.prevElWidth + this.dragEl.clientWidth / 2) {
      return;
    }
    this.left = Math.min(Math.max(left, 0), this.prevElWidth);
    this.value = this.leftToValue(this.left);
    this.left = this.valueToLeft(this.value);
  }

  registerOnChange(fn: any): void {
    this.setViewValue = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: number): void {
    if (value !== null) {
      this.value = value;
      this.left = this.valueToLeft(value);
    }
  }
}
