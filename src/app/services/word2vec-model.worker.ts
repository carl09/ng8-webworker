import './tf-worker';
import { Word2VecService } from './word2vec.service';

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response, undefined);
});

const word2VecService = new Word2VecService();

word2VecService.doit().subscribe(
  chartData => {
    // console.log(chartData);
    postMessage(JSON.stringify(chartData), undefined);
    // this.updateChart(chartData);
  },
  err => {},
  () => {
    close();
  },
);
