import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-users',
  template: `
    <h2>רשימת משתמשים</h2>
    <ul>
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `,
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
