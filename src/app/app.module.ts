import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxFileHelpersModule } from 'ngx-file-helpers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AppIconComponent } from './app-icon/app-icon.component';

@NgModule({
  declarations: [
    AppComponent,
    AppIconComponent
  ],
  imports: [
    AngularSvgIconModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    NgxFileHelpersModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
