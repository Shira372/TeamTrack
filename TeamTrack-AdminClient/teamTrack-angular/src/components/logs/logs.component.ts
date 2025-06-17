import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService, Log } from '../../services/log.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {
  logs: Log[] = [];
  filteredLogs: Log[] = [];

  searchTerm: string = '';
  selectedLevel: string = 'ALL';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.logService.getLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'שגיאה בעת שליפת לוגים';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredLogs = this.logs.filter((log) => {
      const matchesLevel =
        this.selectedLevel === 'ALL' || log.level === this.selectedLevel;
      const matchesSearch = log.message.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesLevel && matchesSearch;
    });
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  filterByLevel(level: string): void {
    this.selectedLevel = level;
    this.applyFilters();
  }
}
