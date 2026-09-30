import { Component, VERSION } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly angularVersion = VERSION.major;

  protected readonly navLinks = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/board', label: 'Task Board', icon: 'view_kanban' },
    { path: '/people', label: 'People', icon: 'group' },
    { path: '/projects', label: 'Projects', icon: 'workspaces' },
  ] as const;
}
