import { Component, OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatSelectModule } from "@angular/material/select"
import { MatFormFieldModule } from "@angular/material/form-field"
import { BaseChartDirective } from "ng2-charts"
import { Chart, type ChartConfiguration, type ChartType, registerables } from "chart.js"
import { ReportService } from "../../services/report.service"

Chart.register(...registerables)

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
  selectedReportType = "users"
  isLoading = false
  private reportService = inject(ReportService)

  // Chart configurations
  public barChartType: ChartType = "bar"
  public pieChartType: ChartType = "pie"
  public lineChartType: ChartType = "line"

  // Users Report Data
  public usersChartData: ChartConfiguration["data"] = {
    labels: ["מנהלים", "עובדים", "אורחים"],
    datasets: [
      {
        label: "מספר משתמשים",
        data: [5, 25, 8],
        backgroundColor: ["#d32f2f", "#ff5722", "#ff9800"],
        borderColor: ["#b71c1c", "#d84315", "#f57c00"],
        borderWidth: 2,
      },
    ],
  }

  // Meetings Report Data
  public meetingsChartData: ChartConfiguration["data"] = {
    labels: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני"],
    datasets: [
      {
        label: "מספר ישיבות",
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: "rgba(211, 47, 47, 0.2)",
        borderColor: "#d32f2f",
        borderWidth: 3,
        fill: true,
      },
    ],
  }

  // Activity Report Data
  public activityChartData: ChartConfiguration["data"] = {
    labels: ["פעיל", "לא פעיל", "חדש"],
    datasets: [
      {
        label: "סטטוס פעילות",
        data: [28, 5, 5],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
        borderColor: ["#388e3c", "#d32f2f", "#f57c00"],
        borderWidth: 2,
      },
    ],
  }

  public chartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Roboto",
            size: 14,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "Roboto",
          },
        },
      },
      x: {
        ticks: {
          font: {
            family: "Roboto",
          },
        },
      },
    },
  }

  ngOnInit(): void {
    this.loadReportData()
  }

  loadReportData(): void {
    this.isLoading = true
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false
    }, 1000)
  }

  onReportTypeChange(): void {
    this.loadReportData()
  }

  exportReport(): void {
    // Implementation for exporting reports
    console.log("Exporting report:", this.selectedReportType)
  }
}
