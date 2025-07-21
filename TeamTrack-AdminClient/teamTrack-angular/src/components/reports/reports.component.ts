import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables,
} from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';
import { User } from '../../models/user.model';
import { Meeting } from '../../models/report.model';
import { firstValueFrom } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('usersCanvas') usersCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('meetingsCanvas') meetingsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('activityCanvas') activityCanvas!: ElementRef<HTMLCanvasElement>;

  selectedReportType = 'users';
  isLoading = false;
  errorMessage = '';

  private toastr = inject(ToastrService);
  private reportService = inject(ReportService);
  private ngZone = inject(NgZone);

  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';
  public lineChartType: ChartType = 'line';

  public usersChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public meetingsChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public activityChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Roboto', size: 14 },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Roboto' } },
      },
      x: {
        ticks: { font: { family: 'Roboto' } },
      },
    },
  };

  totalUsers = 0;
  totalMeetings = 0;
  monthlyGrowth = '+0%';

  private usersChartInstance?: Chart;
  private meetingsChartInstance?: Chart;
  private activityChartInstance?: Chart;

  ngOnInit(): void {
    // No-op
  }

  ngAfterViewInit(): void {
    // גרף בדיקה פשוט, כדי לוודא שה־canvas וה־Chart.js עובדים
    const ctx = this.usersCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('לא ניתן לקבל הקשר 2D מ־usersCanvas');
      return;
    }
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [{
          label: 'Test Data',
          data: [10, 20, 30],
          backgroundColor: ['red', 'green', 'blue']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Test Chart' }
        }
      }
    });

    // לאחר מכן, טען את הנתונים ושרטט את הדוחות האמיתיים (ב־setTimeout כדי לתת ל־canvas להיטען)
    setTimeout(() => this.loadReportData());
  }

  async loadReportData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const users: User[] = await firstValueFrom(this.reportService.getUsers());
      const meetings: Meeting[] = await firstValueFrom(this.reportService.getMeetings());

      if (!users || !meetings) throw new Error('לא התקבלו נתונים מהשרת.');

      this.totalUsers = users.length;
      this.totalMeetings = meetings.length;

      // 🧑‍🤝‍🧑 דוח משתמשים לפי תפקיד
      const roleCounts: Record<string, number> = {};
      users.forEach(user => {
        const role = user.role || 'Other';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });

      this.usersChartData = {
        labels: Object.keys(roleCounts),
        datasets: [{
          label: 'מספר משתמשים',
          data: Object.values(roleCounts),
          backgroundColor: ['#d32f2f', '#ff5722', '#ff9800', '#4CAF50', '#2196F3'],
          borderColor: ['#b71c1c', '#d84315', '#f57c00', '#388E3C', '#1976D2'],
          borderWidth: 2,
        }],
      };

      // 📅 דוח ישיבות לפי חודש
      const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
      const monthlyMeetingCounts: Record<string, number> = {};
      meetings.forEach(m => {
        const date = new Date(m.createdAt);
        const month = monthNames[date.getMonth()];
        monthlyMeetingCounts[month] = (monthlyMeetingCounts[month] || 0) + 1;
      });
      const sortedMonths = monthNames.filter(m => monthlyMeetingCounts[m] !== undefined);
      const sortedMeetingData = sortedMonths.map(m => monthlyMeetingCounts[m]);

      this.meetingsChartData = {
        labels: sortedMonths,
        datasets: [{
          label: 'מספר ישיבות',
          data: sortedMeetingData,
          backgroundColor: 'rgba(211, 47, 47, 0.2)',
          borderColor: '#d32f2f',
          borderWidth: 3,
          fill: true,
        }],
      };

      // 📈 גידול חודשי
      if (sortedMeetingData.length >= 2) {
        const last = sortedMeetingData[sortedMeetingData.length - 1];
        const prev = sortedMeetingData[sortedMeetingData.length - 2];
        if (prev === 0 && last > 0) this.monthlyGrowth = '+100%';
        else if (prev === 0) this.monthlyGrowth = '0%';
        else {
          const growth = ((last - prev) / prev) * 100;
          const sign = growth >= 0 ? '+' : '';
          this.monthlyGrowth = `${sign}${growth.toFixed(1)}%`;
        }
      }

      // 👤 דוח פעילות לפי פגישות
      const userActivity: Record<number, number> = {};
      users.forEach(u => userActivity[u.id] = 0);
      meetings.forEach(m => {
        if (m.createdByUserId)
          userActivity[m.createdByUserId] = (userActivity[m.createdByUserId] || 0) + 1;
      });

      let active = 0, moderate = 0, inactive = 0;
      users.forEach(user => {
        const count = userActivity[user.id] || 0;
        if (count > 5) active++;
        else if (count >= 1) moderate++;
        else inactive++;
      });

      this.activityChartData = {
        labels: ['פעיל', 'בינוני', 'לא פעיל'],
        datasets: [{
          label: 'סטטוס פעילות',
          data: [active, moderate, inactive],
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
          borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
          borderWidth: 2,
        }],
      };

      this.renderCharts();

    } catch (error: any) {
      this.errorMessage = 'שגיאה בטעינת נתונים: ' + (error.message || 'שגיאה לא ידועה');
      this.toastr.error(this.errorMessage, 'שגיאת API');
    } finally {
      this.ngZone.run(() => {
        this.isLoading = false;
      });
    }
  }

  renderCharts(): void {
    this.usersChartInstance?.destroy();
    this.meetingsChartInstance?.destroy();
    this.activityChartInstance?.destroy();

    if (this.selectedReportType === 'users' && this.usersCanvas) {
      const ctx = this.usersCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        console.error('לא ניתן לקבל הקשר 2D מ־usersCanvas');
        return;
      }
      this.usersChartInstance = new Chart(ctx, {
        type: this.barChartType,
        data: this.usersChartData,
        options: this.chartOptions,
      });
    } else if (this.selectedReportType === 'meetings' && this.meetingsCanvas) {
      const ctx = this.meetingsCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        console.error('לא ניתן לקבל הקשר 2D מ־meetingsCanvas');
        return;
      }
      this.meetingsChartInstance = new Chart(ctx, {
        type: this.lineChartType,
        data: this.meetingsChartData,
        options: this.chartOptions,
      });
    } else if (this.selectedReportType === 'activity' && this.activityCanvas) {
      const ctx = this.activityCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        console.error('לא ניתן לקבל הקשר 2D מ־activityCanvas');
        return;
      }
      this.activityChartInstance = new Chart(ctx, {
        type: this.pieChartType,
        data: this.activityChartData,
        options: this.chartOptions,
      });
    }
  }

  onReportTypeChange(): void {
    setTimeout(() => this.renderCharts()); 
  }
}
