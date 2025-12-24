import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './sign-up/sign-up.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule,  FormsModule, ReactiveFormsModule],
})
export class AuthModule {}
