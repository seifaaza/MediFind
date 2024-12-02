import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-topics-categories-links',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, RouterModule, CommonModule],
  templateUrl: './topics-categories-links.component.html',
  styleUrls: ['./topics-categories-links.component.css'],
})
export class TopicsCategoriesLinksComponent {
  categories = [
    {
      title: 'Health Essentials',
      description:
        'Explore a wealth of general health knowledge, from understanding common diseases to practical tips for maintaining a healthy lifestyle.',
      link: '/health-essentials',
      icon: 'health-essentials.svg',
    },
    {
      title: 'Preventive Care',
      description:
        'Learn about essential health screenings, vaccinations, and everyday habits that help prevent illnesses and promote longevity.',
      link: '/preventive-care',
      icon: 'preventive-care.svg',
    },
    {
      title: 'Nutrition & Healthy Eating',
      description:
        'Discover tips for balanced diets, healthy recipes, and how nutrition impacts your overall health and well-being.',
      link: '/nutrition',
      icon: 'nutrition-healthy-eating.svg',
    },
    {
      title: 'Fitness & Physical Health',
      description:
        'Get tips and guidance on maintaining physical fitness through exercise, movement, and strength training.',
      link: '/fitness',
      icon: 'fitness-physical-health.svg',
    },
    {
      title: 'Mental Well-being',
      description:
        ' Explore strategies for managing stress, anxiety, and maintaining emotional balance to support your mental health.',
      link: '/mental-well-being',
      icon: 'mental-well-being.svg',
    },
    {
      title: 'Addiction Recovery & Support',
      description:
        'Understand how to manage and live well with chronic health conditions through education and lifestyle changes.',
      link: '/addiction',
      icon: 'addiction-recovery.svg',
    },
  ];
}
