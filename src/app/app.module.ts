import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OpenFileReceiveComponent } from './open-file-receive/open-file-receive.component';
import { CurrentFileComponent } from './current-file/current-file.component';
import { ArchivecompilationserviceComponent } from './archivecompilationservice/archivecompilationservice.component';
import { RatingModalComponent } from './modal/rating-modal/rating-modal.component';
import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';
import { CoverComponent } from './cover/cover.component';
import { CurrentFileServiceService } from './service/currentFile/current-file-service.service';
import { ErrorModalComponent } from './modal/error-modal/error-modal.component';
import { LoginModalComponent } from './modal/login-modal/login-modal.component';


const routes: Routes = [
  { path: 'login', component: LoginModalComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'openFile', component: OpenFileReceiveComponent },
  { path: 'currentFile', component: CurrentFileComponent },
  { path: 'archivecompilationservice', component: ArchivecompilationserviceComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    OpenFileReceiveComponent,
    CurrentFileComponent,
    ArchivecompilationserviceComponent,
    RatingModalComponent,
    FormComponent,
    TableComponent,
    CoverComponent,
    ErrorModalComponent,
    LoginModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [CurrentFileServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
