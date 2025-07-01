import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BaseChartDirective } from "ng2-charts";
import {
  Chart,
  type ChartConfiguration,
  type ChartType,
  registerables,
} from "chart.js";
import { ToastrService } from "ngx-toastr";

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
    BaseChartDirective,
  ],
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  selectedReportType = "users";
  isLoading = false;
  errorMessage = "";

  private toastr = inject(ToastrService);

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

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading = true;
    this.errorMessage = "";

    // דוגמה לנתונים סטטיים במקום לקרוא ל-getReportData
    switch (this.selectedReportType) {
      case "users":
        this.usersChartData = {
          labels: ["Admin", "User", "Guest"],
          datasets: [
            {
              label: "מספר משתמשים",
              data: [10, 20, 8],
              backgroundColor: ["#d32f2f", "#ff5722", "#ff9800"],
              borderColor: ["#b71c1c", "#d84315", "#f57c00"],
              borderWidth: 2,
            },
          ],
        };
        break;

      case "meetings":
        this.meetingsChartData = {
          labels: ["ינואר", "פברואר", "מרץ"],
          datasets: [
            {
              label: "מספר ישיבות",
              data: [5, 10, 7],
              backgroundColor: "rgba(211, 47, 47, 0.2)",
              borderColor: "#d32f2f",
              borderWidth: 3,
              fill: true,
            },
          ],
        };
        break;

      case "activity":
        this.activityChartData = {
          labels: ["פעיל", "לא פעיל", "בינוני"],
          datasets: [
            {
              label: "סטטוס פעילות",
              data: [15, 5, 8],
              backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
              borderColor: ["#388e3c", "#d32f2f", "#f57c00"],
              borderWidth: 2,
            },
          ],
        };
        break;
    }

    this.isLoading = false;
  }

  onReportTypeChange(): void {
    this.loadReportData();
  }

  exportReport(): void {
    console.log("Exporting report:", this.selectedReportType);
  }
}
