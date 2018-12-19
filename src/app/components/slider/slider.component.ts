import { Component, Input, OnInit, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { OptiopnsModel } from '../../interface/options-model';
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
  @Input() options: OptiopnsModel;

  data: Array<{
    count: number;
    width: number;
    hoverText?: string;
  }>;
  left = 0;
  value = 0;
  min: number;
  max: number;
  unmove = true;
  setViewValue: (value: number) => void;
  disabled = false;
  dragEl: Element;
  prevElWidth: number;

  constructor(private ref: ElementRef) {}


  ngOnInit() {
    this.initEl();
    setTimeout(window.onresize);
  }

  ngOnDestroy() {
    window.onresize = window.onmousemove = window.onmouseup = null;
  }

  initEl() {
    this.dragEl = this.ref.nativeElement.children[0].children[1];
    this.prevElWidth = this.ref.nativeElement.children[0].children[0].clientWidth - this.dragEl.clientWidth;
    this.data = this.options.data.sort((x, y) => x.count - y.count);
    this.min = this.options.min || 0;
    this.max = this.options.max || this.data[this.data.length - 1].count;

    window.onresize = () => {
      this.initEl();
      this.left = this.valueToLeft(this.value);
    };
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

  findIndex(w): {index: number, beforeWidth: number} {
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

  leftToValue(left): number {
    const _left = left * 100 / this.prevElWidth;
    const { index, beforeWidth } = this.findIndex(_left);
    const data = this.data[index];

    let value;
    if (index) {
      value = this.data[index - 1].count + (data.count - this.data[index - 1].count) * (_left - beforeWidth) / data.width;
    } else {
      value = data.count * _left / data.width;
    }
    value = Math.round(value / this.options.step) * this.options.step;
    this.setViewValue(value);
    return value;
  }

  valueToLeft(value): number {
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
    if (this.value < this.min) {
      this.value = this.min;
    }
    if (this.value > this.max) {
      this.value = this.max;
    }
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

  registerOnTouched(fn: any): void {
  }

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
