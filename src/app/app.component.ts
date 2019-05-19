import { Component, OnInit } from '@angular/core';
import { Word2VecService } from './services/word2vec.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng8-webworker';

  constructor() {}

  ngOnInit(): void {}
}
