import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { sentence } from './data';
import {
  removeStopWords,
  getUniqueWords,
  generateTrainingData,
  createChartData,
  ChartData,
} from './utils';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Word2VecService {
  public doit(): Observable<ChartData[]> {
    const tidySentence = sentence.map(removeStopWords);
    const words = getUniqueWords(tidySentence);

    const encodeLength = words.length;

    const word2int: { [id: string]: number } = words.reduce((a, w, i) => {
      a[w] = i;
      return a;
    }, {});

    const model = tf.sequential();
    // Create Input and Hidden Layers
    model.add(
      tf.layers.dense({
        units: 1,
        inputShape: [encodeLength],
        activation: 'softplus',
        useBias: true,
      }),
    );
    // Create Output Layers
    model.add(
      tf.layers.dense({
        units: encodeLength,
        activation: 'softmax',
      }),
    );
    // Options for training
    model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: tf.train.adamax(0.5),
    });

    model.summary();

    const results: Array<{ data: number; label: number }> = [];

    for (let index = 0; index < 4; index++) {
      tidySentence.forEach(x => {
        const result = generateTrainingData(x);

        result.forEach(y => {
          if (y.left) {
            results.push({
              data: word2int[y.data],
              label: word2int[y.left],
            });
          }
          if (y.right) {
            results.push({
              data: word2int[y.data],
              label: word2int[y.right],
            });
          }
        });
      });
    }

    const dataTensor = tf.oneHot(
      tf.tensor1d([...results.map(x => x.data)], 'int32'),
      encodeLength,
    );
    const labelTensor = tf.oneHot(
      tf.tensor1d([...results.map(x => x.label)], 'int32'),
      encodeLength,
    );

    const output$ = new Subject<ChartData[]>();

    model
      .fit(dataTensor, labelTensor, {
        epochs: 100,
        shuffle: true,
        yieldEvery: 'never',
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            if (epoch % 10 === 0) {
              output$.next(createChartData(model, words));
            }

            // console.log(epoch, logs.loss);
            // console.log(createChartData(model, words));
          },
        },
      })
      .then(x => {
        dataTensor.dispose();
        labelTensor.dispose();
        output$.complete();
      })
      .catch(err => {
        dataTensor.dispose();
        labelTensor.dispose();
        console.error(err);
        output$.error(err);
      });

    return output$.asObservable();
  }
}
