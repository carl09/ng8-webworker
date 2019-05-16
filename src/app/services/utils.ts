import * as tf from '@tensorflow/tfjs';

interface WindowTrainData {
  data: string;
  left: string;
  right: string;
}

export interface ChartData {
  x: number;
  y: number;
  label: string;
}

export const removeStopWords = (line: string): string => {
  const stopWords = ['is', 'a', 'will', 'be', 'to', 'the'];

  return line
    .split(' ')
    .map(x => {
      if (stopWords.indexOf(x) === -1) {
        return x.toLowerCase();
      }
      return undefined;
    })
    .filter(x => !!x)
    .join(' ');
};

export const getUniqueWords = (lines: string[]): string[] => {
  const wordSet = new Set();

  lines.forEach(l => l.split(' ').forEach(w => wordSet.add(w)));

  return Array.from(wordSet);
};

const resolveWindow = (
  max: number,
  index: number,
): { left: number; right: number } => {
  const out: { left: number; right: number } = { left: -1, right: -1 };

  if (index === 0) {
    out.left = 1;
  } else if (index === max) {
    out.left = max - 1;
  } else {
    out.left = index - 1;
  }

  if (index === 0) {
    out.right = 2;
  } else if (index === max) {
    out.right = max - 1;
    out.left = max - 2;
  } else {
    out.right = index + 1;
  }
  return out;
};

export const generateTrainingData = (line: string): WindowTrainData[] => {
  const items = line.split(' ');

  const results: WindowTrainData[] = [];

  for (let i = 0; i < items.length; i++) {
    const resolveNabours = resolveWindow(items.length - 1, i);

    results.push({
      data: items[i],
      left: items[resolveNabours.left],
      right: items[resolveNabours.right],
    });
  }

  return results;
};

export const createChartData = (
  model: tf.LayersModel,
  lookup: string[],
): ChartData[] => {
  const weights = model.layers[1].getWeights()[0].dataSync();
  const bias = model.layers[1].getWeights()[1].dataSync();

  const matrix: Array<{
    x: number;
    y: number;
    label: string;
    color: string;
  }> = [];

  for (let index = 0; index < weights.length; index++) {
    const x = weights[index];
    const y = bias[index];
    matrix.push({
      x,
      y,
      label: lookup[index],
      color: '#ccc',
    });
  }

  return matrix;
};
