import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { environment } from './environments/environment';
import { AppRoutingModule } from './app/app-routing.module';
import { jwtInterceptor } from './app/demo/pages/authentication/jwt.interceptor'; // Adjust the path as necessary
import { AppComponent } from './app/app.component';
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
}).catch((err) => console.error(err));
