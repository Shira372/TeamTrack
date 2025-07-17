import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BaseChartDirective } from 'ng2-charts'; 
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';

Chart.register(...registerables);

@Component({
  selector: "app-reports",
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
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  @ViewChild("usersChart") usersChart?: BaseChartDirective;
  @ViewChild("meetingsChart") meetingsChart?: BaseChartDirective;
  @ViewChild("activityChart") activityChart?: BaseChartDirective;

  selectedReportType = "users";
  isLoading = false;
  errorMessage = "";
  private toastr = inject(ToastrService);
  private reportService = inject(ReportService);

  public barChartType: ChartType = "bar";
  public pieChartType: ChartType = "pie";
  public lineChartType: ChartType = "line";

  public usersChartData: ChartConfiguration["data"] = { labels: [], datasets: [] };
  public meetingsChartData: ChartConfiguration["data"] = { labels: [], datasets: [] };
  public activityChartData: ChartConfiguration["data"] = { labels: [], datasets: [] };

  public chartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { family: "Roboto", size: 14 } },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: "Roboto" } },
      },
      x: {
        ticks: { font: { family: "Roboto" } },
      },
    },
  };

  totalUsers = 0;
  totalMeetings = 0;
  monthlyGrowth = "+0%";

  ngOnInit(): void {
    this.loadReportData();
  }

  async loadReportData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = "";

    try {
      const users = await this.reportService.getUsers().toPromise();
      const meetings = await this.reportService.getMeetings().toPromise();

      if (!users || !meetings) {
        throw new Error("לא התקבלו נתונים מהשרת.");
      }

      this.totalUsers = users.length;
      this.totalMeetings = meetings.length;

      const roleCounts: { [key: string]: number } = {};
      users.forEach((user) => {
        const role = user.role || "Other";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });

      this.usersChartData = {
        labels: Object.keys(roleCounts),
        datasets: [
          {
            label: "מספר משתמשים",
            data: Object.values(roleCounts),
            backgroundColor: ["#d32f2f", "#ff5722", "#ff9800", "#4CAF50", "#2196F3"],
            borderColor: ["#b71c1c", "#d84315", "#f57c00", "#388E3C", "#1976D2"],
            borderWidth: 2,
          },
        ],
      };

      const monthlyMeetingCounts: { [key: string]: number } = {};
      const monthNames = [
        "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
        "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
      ];

      meetings.forEach((meeting) => {
        const date = new Date(meeting.createdAt);
        const month = monthNames[date.getMonth()];
        monthlyMeetingCounts[month] = (monthlyMeetingCounts[month] || 0) + 1;
      });

      const sortedMonths = monthNames.filter((month) => monthlyMeetingCounts[month] !== undefined);
      const sortedMeetingData = sortedMonths.map((month) => monthlyMeetingCounts[month]);

      this.meetingsChartData = {
        labels: sortedMonths,
        datasets: [
          {
            label: "מספר ישיבות",
            data: sortedMeetingData,
            backgroundColor: "rgba(211, 47, 47, 0.2)",
            borderColor: "#d32f2f",
            borderWidth: 3,
            fill: true,
          },
        ],
      };

      const userActivity: { [userId: number]: number } = {};
      meetings.forEach((meeting) => {
        if (meeting.createdByUserId) {
          userActivity[meeting.createdByUserId] = (userActivity[meeting.createdByUserId] || 0) + 1;
        }
      });

      let activeUsers = 0;
      let moderateUsers = 0;
      let inactiveUsers = 0;

      users.forEach((user) => {
        const meetingsCreated = userActivity[user.id] || 0;
        if (meetingsCreated > 5) {
          activeUsers++;
        } else if (meetingsCreated >= 1) {
          moderateUsers++;
        } else {
          inactiveUsers++;
        }
      });

      this.activityChartData = {
        labels: ["פעיל", "בינוני", "לא פעיל"],
        datasets: [
          {
            label: "סטטוס פעילות",
            data: [activeUsers, moderateUsers, inactiveUsers],
            backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
            borderColor: ["#388e3c", "#f57c00", "#d32f2f"],
            borderWidth: 2,
          },
        ],
      };
    } catch (error: any) {
      this.errorMessage = "שגיאה בטעינת נתונים: " + (error.message || "שגיאה לא ידועה");
      this.toastr.error(this.errorMessage, "שגיאת API");
      console.error("Error loading report data:", error);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 50);
    }
  }

  onReportTypeChange(): void {
    this.loadReportData();
  }
}
