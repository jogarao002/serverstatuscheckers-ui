import { AfterViewInit, Component, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { AuthorizationService } from '../../service/authorization.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent implements AfterViewInit {

  canvas: any;

  ctx: any;

  @ViewChild('pieCanvas') pieCanvas!: { nativeElement: any };

  pieChart: any;

  errorMessage: string = '';

  constructor(private authorizationService: AuthorizationService, private messageService: MessageService) { }

  ngAfterViewInit(): void {
    this.pieChartBrowser();
  }

  getRandomColor(total: number): string[] {
    const letters = '0123456789ABCDEF';
    const colors: string[] = [];

    for (let i = 0; i < total; i++) {
      let color = '#';
      // Generate a 6-character hex color code
      for (let j = 0; j < 6; j++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
    return colors;
  }

  convertCountToTime(count: number): string {
    const timeInMinutes = count * 15;  // Each count corresponds to 15 minutes
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;

    // Format time as "X hours Y mins" or "X mins"
    if (hours > 0) {
      return `${hours} hours ${minutes} mins`;
    } else {
      return `${minutes} mins`;
    }
  }


  pieChartBrowser(): void {
    this.authorizationService.getAllServers().subscribe(
      (response) => {
        if (response.error) {
          this.messageService.add({ summary: response.error, detail: response.statusMsg });
        } else {
          // Filter the servers where inactiveCount is greater than zero
          const filteredServers = response.data.filter((server: any) => server.inactiveCount > 0);

          // Extract the labels and data from the filtered servers
          const labels = filteredServers.map((server: any) => server.serviceName);
          const data = filteredServers.map((server: any) => server.inactiveCount);

          // Generate random colors for the filtered servers
          const color = this.getRandomColor(filteredServers.length);

          // Prepare the canvas and context for the pie chart
          this.canvas = this.pieCanvas.nativeElement;
          this.ctx = this.canvas.getContext('2d');

          // Create the pie chart
          this.pieChart = new Chart(this.ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [
                {
                  backgroundColor: ['#081F5C','#376092','#B4560F','#70AD47','#7F0000','#558ED5','#999900','#FF7300'],
                  data: data
                }
              ]
            },
            options: {
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem: any) => {
                      const count = tooltipItem.raw;
                      const time = this.convertCountToTime(count);
                      return `Inactive time - ${time}`;
                    }
                  }
                }
              }
            }
          });
        }
      },
      (error) => {
        // Handle any unexpected errors (this shouldn't be triggered if `catchError` is in the service)
        this.errorMessage = 'An unexpected error occurred.';
        console.error('Error loading servers:', error);
      }
    );
  }


}
