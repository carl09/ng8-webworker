import { Component, OnInit } from '@angular/core';
import { Word2VecService } from './services/word2vec.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng8-webworker';

  constructor(private word2VecService: Word2VecService) {}

  ngOnInit(): void {
    this.word2VecService.doit();
  }
}
