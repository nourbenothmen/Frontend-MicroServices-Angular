import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
//import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtInterceptor } from './app/demo/pages/authentication/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from './environments/environment';
import { AppRoutingModule } from './app/app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app/app.component';
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()), // Angular va chercher les interceptors injectables
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true } // <-- ici
  ]
}).catch(err => console.error(err));
