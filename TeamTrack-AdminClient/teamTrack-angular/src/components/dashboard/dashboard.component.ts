import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  stats: any;

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: res => this.stats = res,
      error: err => console.error('Failed to load stats', err)
    });
  }
}
