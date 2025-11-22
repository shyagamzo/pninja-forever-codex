import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CandleService } from './services/candle.service';
import { GooglePhotosService, PhotoItem } from './services/google-photos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [CandleService, GooglePhotosService],
  template: `
    <div class="page">
      <header class="hero">
        <div class="hero__content">
          <p class="eyebrow">In Loving Memory</p>
          <h1>Celebrating Mom's Light</h1>
          <p class="lede">
            A place to remember her warmth, celebrate her laughter, and keep her light burning.
          </p>
          <div class="hero__cta">
            <a class="btn" href="#gallery">View her photos</a>
            <a class="btn ghost" href="#candle">Light a candle</a>
          </div>
        </div>
        <div class="hero__glow"></div>
      </header>

      <section class="section" id="gallery">
        <div class="section__header">
          <div>
            <p class="eyebrow">Google Photos integration</p>
            <h2>Her favorite moments</h2>
            <p class="section__lede">
              Connect a Google Photos album to show the moments that best tell her story.
            </p>
          </div>
          <div class="album-config">
            <label>API Key <input [(ngModel)]="apiKey" type="password" placeholder="Photos API key" /></label>
            <label>Album Id <input [(ngModel)]="albumId" placeholder="Google Photos album id" /></label>
            <button class="btn small" (click)="loadPhotos()">Load album</button>
          </div>
        </div>

        <div class="gallery" *ngIf="photos().length; else emptyState">
          <article class="photo" *ngFor="let photo of photos()">
            <img [src]="photo.baseUrl" [alt]="photo.filename" loading="lazy" />
            <div class="photo__meta">
              <p>{{ photo.description || 'Shared with love' }}</p>
              <small>{{ photo.mediaMetadata?.creationTime | date: 'longDate' }}</small>
            </div>
          </article>
        </div>
        <ng-template #emptyState>
          <div class="empty">
            <p>Enter a valid Google Photos API key and album id to display her pictures.</p>
          </div>
        </ng-template>
      </section>

      <section class="section candle" id="candle">
        <div class="section__header">
          <div>
            <p class="eyebrow">A quiet corner</p>
            <h2>Light a virtual candle</h2>
            <p class="section__lede">
              Leave a message and keep her light burning bright. Each candle glows softly to honor her memory.
            </p>
          </div>
          <div class="candle__status">
            <span class="pill" [class.lit]="isLit()">{{ isLit() ? 'Candle lit' : 'Waiting to be lit' }}</span>
          </div>
        </div>

        <div class="candle__content">
          <div class="candle__visual" [class.lit]="isLit()">
            <div class="flame"></div>
            <div class="wick"></div>
            <div class="body"></div>
          </div>
          <div class="candle__form">
            <label>Message <textarea [(ngModel)]="message" rows="3" placeholder="Share a note or memory"></textarea></label>
            <div class="actions">
              <button class="btn" (click)="lightCandle()">Light candle</button>
              <button class="btn ghost" (click)="resetCandle()" *ngIf="isLit()">Extinguish</button>
            </div>
            <div class="message" *ngIf="isLit()">
              <p class="eyebrow">Your tribute</p>
              <p class="lede">{{ storedMessage() }}</p>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <p>Made with love to honor Mom's beautiful life.</p>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiKey = '';
  albumId = '';
  message = '';

  readonly photos = signal<PhotoItem[]>([]);
  readonly isLit = computed(() => this.candleService.isLit());
  readonly storedMessage = computed(() => this.candleService.message());

  constructor(private candleService: CandleService, private photosService: GooglePhotosService) {}

  async loadPhotos(): Promise<void> {
    if (!this.apiKey || !this.albumId) {
      this.photos.set([]);
      return;
    }
    const items = await this.photosService.fetchAlbumPhotos(this.apiKey, this.albumId);
    this.photos.set(items);
  }

  lightCandle(): void {
    this.candleService.light(this.message.trim());
  }

  resetCandle(): void {
    this.candleService.extinguish();
    this.message = '';
  }
}
