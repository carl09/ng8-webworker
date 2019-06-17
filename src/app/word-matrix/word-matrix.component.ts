import { ChartData } from './../services/utils';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Word2VecService } from '../services/word2vec.service';
import { WrapperService } from '../services/wrapper.service';

@Component({
  selector: 'app-word-matrix',
  templateUrl: './word-matrix.component.html',
})
export class WordMatrixComponent implements OnInit {
  @ViewChild('canvas')
  canvas: ElementRef;

  public chart: Chart;

  constructor(
    private word2VecService: Word2VecService,
    private wrapperService: WrapperService,
  ) {}

  ngOnInit() {
    const ctx = this.canvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [],
      },
      options: {
        title: {
          text: 'accuracy curve',
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              display: true,
              drawBorder: false,
            },
          ],
          yAxes: [
            {
              display: true,
              drawBorder: false,
            },
          ],
          gridLines: {
            drawBorder: true,
          },
        },
        tooltips: {
          bodyFontSize: 20,
          callbacks: {
            label(tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label || '';
            },
          },
        },
      },
    });
  }

  start() {
    this.wrapperService.start().subscribe(chartData => {
      console.log('worker');
      this.updateChart(chartData);
    });

    // this.word2VecService.doit().subscribe(chartData => {
    //   console.log('in memory');
    //   this.updateChart(chartData);
    // });
  }

  private updateChart(chartData: ChartData[]) {
    if (this.chart.data.datasets.length === 0) {
      chartData.forEach(i => {
        this.chart.data.datasets.push({
          label: i.label,
          data: [
            {
              x: 0,
              y: 0,
              r: 20,
            },
          ],
        });
      });
    } else {
      this.chart.data.datasets.forEach((dataset, i) => {
        dataset.data[0] = {
          x: chartData[i].x,
          y: chartData[i].y,
          r: 20,
        };
      });
    }

    this.chart.update();
  }
}
