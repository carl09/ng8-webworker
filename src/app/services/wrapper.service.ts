import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ChartData } from './utils';

// const worker = new Worker('./app.worker', { type: 'module' });
// worker.onmessage = ({ data }) => {
//   console.log('page got message: $\{data\}');
// };

@Injectable({
  providedIn: 'root',
})
export class WrapperService {
  start(): Observable<ChartData[]> {
    const worker = new Worker('./word2vec-model.worker', { type: 'module' });

    const output$ = new Subject<ChartData[]>();

    worker.onmessage = ({ data }) => {
      // console.log('page got message:', data);
      output$.next(JSON.parse(data));
    };

    return output$.asObservable();
  }
}
