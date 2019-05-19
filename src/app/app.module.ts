import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WordMatrixComponent } from './word-matrix/word-matrix.component';

@NgModule({
  declarations: [AppComponent, WordMatrixComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
