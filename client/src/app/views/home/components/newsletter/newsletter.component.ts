import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HttpClientModule } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../../environments/environment.prod';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewsletterComponent implements AfterViewInit, OnDestroy {
  apiUrl = environment.API_URL;
  newsletterForm: FormGroup;
  loading = false; // Controls the loading spinner
  messageRef: any; // Reference to the current loading message

  @ViewChild('lordIcon') lordIcon!: ElementRef;

  private fadeInObserver!: IntersectionObserver;
  private lordIconObserver!: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.newsletterForm.invalid) {
      this.message.error('Please enter a valid email address.');
      return;
    }

    const email = this.newsletterForm.get('email')?.value;
    this.loading = true; // Start loading

    // Show a loading message
    this.messageRef = this.message.loading('Processing your subscription...', {
      nzDuration: 0,
    });

    this.http
      .post(`${this.apiUrl}/newsletter/subscribe`, { email })
      .pipe(
        catchError((error) => {
          // Display error message
          this.message.error(
            error.error?.message ||
              'An error occurred while subscribing. Please try again later.',
            { nzDuration: 2500 }
          );
          return of(null); // Return a null observable
        }),
        finalize(() => {
          this.loading = false; // Always stop loading
          if (this.messageRef) {
            this.message.remove(this.messageRef.messageId); // Clear loading message
          }
        })
      )
      .subscribe((response) => {
        if (response) {
          // Display success message
          this.message.success('Thank you for subscribing to our newsletter!', {
            nzDuration: 2500,
          });
          this.newsletterForm.reset(); // Reset the form on success
        }
      });
  }

  ngAfterViewInit(): void {
    this.fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            if (entry.target === this.lordIcon.nativeElement) {
              this.lordIcon.nativeElement.setAttribute('trigger', 'in');
            }
            this.fadeInObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    const fadeElements = this.el.nativeElement.querySelectorAll('.fade-in');
    fadeElements.forEach((el: HTMLElement) => {
      this.fadeInObserver.observe(el);
    });

    if (this.lordIcon) {
      this.lordIconObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.lordIcon.nativeElement.setAttribute('trigger', 'in');
          }
        },
        { threshold: 0.5 }
      );
      this.lordIconObserver.observe(this.lordIcon.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.fadeInObserver?.disconnect();
    this.lordIconObserver?.disconnect();
  }
}
