import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UiSwitchModule } from 'ngx-ui-switch';
import { StorageServiceModule } from 'ngx-webstorage-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthenticationHttpInterceptor } from './services/auth.http-interceptor';
import { AuthenticationServiceProvider } from './services/auth.service.provider';
import { LocalStorageService } from './services/local-storage.service';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    UiSwitchModule,
    StorageServiceModule
  ],
  declarations: [
    AppComponent, DashboardPageComponent
  ],
  providers: [
    LocalStorageService,
    AuthenticationServiceProvider, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
