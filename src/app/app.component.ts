import { Component } from '@angular/core';
import { DataModel } from './interface/options-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: DataModel[] = [
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
  ];
  unit = 'GB';
  step = 100;
  showInput = true;
  value = 3200;
}
