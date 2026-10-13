import { Injectable } from '@angular/core';

export interface LightboxAlbum {
  src: string;
  caption?: string;
  thumb?: string;
  downloadUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppLightboxService {
  private overlay: HTMLElement | null = null;
  private albums: LightboxAlbum[] = [];
  private currentIndex = 0;
  private readonly keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowLeft') this.show(this.currentIndex - 1);
    if (event.key === 'ArrowRight') this.show(this.currentIndex + 1);
  };

  open(albums: LightboxAlbum[], index = 0): void {
    if (typeof document === 'undefined' || !albums?.length) return;

    this.albums = albums;
    this.currentIndex = this.normalizeIndex(index);

    if (!this.overlay) {
      this.overlay = this.createOverlay();
      document.body.appendChild(this.overlay);
      document.addEventListener('keydown', this.keydownHandler);
    }

    document.body.style.overflow = 'hidden';
    this.show(this.currentIndex);
  }

  close(): void {
    if (!this.overlay || typeof document === 'undefined') return;

    document.removeEventListener('keydown', this.keydownHandler);
    this.overlay.remove();
    this.overlay = null;
    document.body.style.overflow = '';
  }

  private show(index: number): void {
    if (!this.overlay || !this.albums.length) return;

    this.currentIndex = this.normalizeIndex(index);
    const album = this.albums[this.currentIndex];
    const image = this.overlay.querySelector<HTMLImageElement>('.app-lightbox-image');
    const caption = this.overlay.querySelector<HTMLElement>('.app-lightbox-caption');
    const counter = this.overlay.querySelector<HTMLElement>('.app-lightbox-counter');

    if (image) {
      image.src = album.src;
      image.alt = album.caption || 'Bus photo';
    }

    if (caption) caption.textContent = album.caption || '';
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.albums.length}`;
  }

  private normalizeIndex(index: number): number {
    if (!this.albums.length) return 0;
    return (index + this.albums.length) % this.albums.length;
  }

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'app-lightbox-overlay';
    overlay.innerHTML = `
      <button type="button" class="app-lightbox-close" aria-label="Close">&times;</button>
      <button type="button" class="app-lightbox-nav app-lightbox-prev" aria-label="Previous image">&#8249;</button>
      <img class="app-lightbox-image" alt="Bus photo">
      <button type="button" class="app-lightbox-nav app-lightbox-next" aria-label="Next image">&#8250;</button>
      <div class="app-lightbox-footer">
        <span class="app-lightbox-caption"></span>
        <span class="app-lightbox-counter"></span>
      </div>
    `;

    overlay.querySelector('.app-lightbox-close')?.addEventListener('click', () => this.close());
    overlay.querySelector('.app-lightbox-prev')?.addEventListener('click', () => this.show(this.currentIndex - 1));
    overlay.querySelector('.app-lightbox-next')?.addEventListener('click', () => this.show(this.currentIndex + 1));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) this.close();
    });

    return overlay;
  }
}
