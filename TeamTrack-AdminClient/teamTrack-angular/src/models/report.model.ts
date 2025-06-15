export interface ReportData {
    id: number
    title: string
    type: "meetings" | "users" | "activity"
    data: any[]
    createdAt: Date
  }
  
  export interface ChartData {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
    }[]
  }
  