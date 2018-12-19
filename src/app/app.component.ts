import { Component } from '@angular/core';
import { OptiopnsModel } from './interface/options-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options: OptiopnsModel;
  value = 3200;

  constructor() {
    this.options = {
      unit: 'GB',
      step: 100,
      showInput: true,
      data: [
        {
          count: 5000,
          width: 10,
        },
        {
          count: 500,
          width: 50,
        },
        {
          count: 1000,
          width: 20,
        },
        {
          count: 2000,
          width: 20,
        }
      ],
    };
  }
}
