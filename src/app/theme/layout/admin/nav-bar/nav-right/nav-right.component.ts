// angular import
import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../demo/pages/authentication/AuthService'; // ajuste le chemin si nécessaire
import { Router } from '@angular/router';


// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, ChatUserListComponent, ChatMsgComponent],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent {
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;

  // constructor
  constructor(private authService: AuthService, private router: Router) {
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  // public method
  // eslint-disable-next-line
  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  logout() {
    this.authService.logout();  // appelle la méthode du service
    this.router.navigate(['/login']); // redirige vers la page de login après déconnexion
  }
}
