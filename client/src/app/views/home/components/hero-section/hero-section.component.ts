import { Component, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  imports: [NzButtonModule, NzIconModule, RouterModule, CommonModule],
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent implements AfterViewInit {
  stats = [
    { value: 2000, text: 'Medicines Cataloged' },
    { value: 95, text: 'Accurate Recommendations' },
    { value: 5000, text: 'Active Community Members' },
    { value: 1000, text: 'Daily Health Logs' },
  ];
  getStartedRoute = '/create-profile';
  isAuthenticated = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if the user is authenticated
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.getStartedRoute = '/create-profile/personal-info';
    }
  }

  ngAfterViewInit(): void {
    // Apply rolling text effect
    const rollingTextElements =
      this.el.nativeElement.querySelectorAll('.rolling-text');
    rollingTextElements.forEach(
      (rollingTextElement: HTMLElement, index: number) => {
        const titleText = rollingTextElement.innerText;
        rollingTextElement.innerHTML = '';

        Array.from(titleText).forEach((letter, letterIndex) => {
          const span = this.renderer.createElement('span');
          this.renderer.addClass(span, 'letter');
          span.style.animationDelay = `${letterIndex * 0.01}s`;
          span.innerText = letter === ' ' ? '\xa0' : letter;
          this.renderer.appendChild(rollingTextElement, span);

          if (index === 1) {
            span.style.animationDelay = `${(letterIndex + 20) * 0.01}s`;
          }
        });
      }
    );

    // Apply fade-in animation with a delay for each stat
    const statElements =
      this.el.nativeElement.querySelectorAll('.stats-fade-in');
    statElements.forEach((statElement: HTMLElement, index: number) => {
      statElement.style.animationDelay = `${index * 0.3}s`;
    });

    // Start the counting animation for each stat
    this.animateStats();
  }

  animateStats(): void {
    this.stats.forEach((stat, index) => {
      this.startCounting(stat, index);
    });
  }

  startCounting(stat: any, index: number): void {
    const element =
      this.el.nativeElement.querySelectorAll('.stats-fade-in')[index];
    const targetValue = stat.value;
    let currentValue = 0;
    const duration = 2500; // Duration of counting in ms
    const stepTime = 50; // Interval between each update in ms
    const totalSteps = duration / stepTime; // Total number of steps

    // Calculate how much to increment at each step
    const increment = targetValue / totalSteps;

    const updateCounter = () => {
      currentValue += increment;

      // Ensure it doesn't exceed the target value
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(interval); // Stop once the target value is reached
      }

      // Format and update the value
      const formattedValue = this.formatNumber(
        Math.floor(currentValue),
        stat.value
      );
      element.querySelector('p').innerText = formattedValue;
    };

    // Set interval to update the counter at fixed steps
    const interval = setInterval(updateCounter, stepTime);
  }

  formatNumber(number: number, value: number): string {
    // Format the number with commas for better readability (e.g., 1,000 instead of 1000)
    let formattedValue = number.toLocaleString();

    // Add '+' sign for all numbers except for percentages
    if (typeof value === 'number' && value !== 95) {
      formattedValue = `+${formattedValue}`;
    }

    // Append '%' for percentage-based values
    if (typeof value === 'number' && value === 95) {
      formattedValue = `+${formattedValue}%`;
    }

    return formattedValue;
  }
}
