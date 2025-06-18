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
import { ReportService } from "../../services/report.service";
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

  private reportService = inject(ReportService);
  private toastr = inject(ToastrService);

  public barChartType: ChartType = "bar";
  public pieChartType: ChartType = "pie";
  public lineChartType: ChartType = "line";

  public usersChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [],
  };

  public meetingsChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [],
  };

  public activityChartData: ChartConfiguration["data"] = {
    labels: [],
    datasets: [],
  };

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
  };

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.reportService.getReportData(this.selectedReportType).subscribe({
      next: (data) => {
        switch (this.selectedReportType) {
          case "users":
            this.usersChartData = {
              labels: data.labels,
              datasets: [
                {
                  label: data.label,
                  data: data.values,
                  backgroundColor: ["#d32f2f", "#ff5722", "#ff9800"],
                  borderColor: ["#b71c1c", "#d84315", "#f57c00"],
                  borderWidth: 2,
                },
              ],
            };
            break;

          case "meetings":
            this.meetingsChartData = {
              labels: data.labels,
              datasets: [
                {
                  label: data.label,
                  data: data.values,
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
              labels: data.labels,
              datasets: [
                {
                  label: data.label,
                  data: data.values,
                  backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
                  borderColor: ["#388e3c", "#d32f2f", "#f57c00"],
                  borderWidth: 2,
                },
              ],
            };
            break;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = "שגיאה בטעינת הדוח";
        this.toastr.error(this.errorMessage);
      },
    });
  }

  onReportTypeChange(): void {
    this.loadReportData();
  }

  exportReport(): void {
    console.log("Exporting report:", this.selectedReportType);
  }
}
