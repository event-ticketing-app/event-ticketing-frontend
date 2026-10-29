import { Component, OnDestroy, model, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CloudinaryService, EVENT_IMAGE_HEIGHT, EVENT_IMAGE_WIDTH } from '../../services/cloudinary';

const MAX_IMAGE_SIZE_MB = 10;

/**
 * Drag & drop (or click) WebP image upload to Cloudinary.
 * Usage: <app-image-upload [(imageUrl)]="imageUrl" [(uploading)]="uploading" />
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUpload implements OnDestroy {
  imageUrl = model<string>('');
  uploading = model<boolean>(false);

  readonly maxSizeMb = MAX_IMAGE_SIZE_MB;
  readonly recommendedSize = `${EVENT_IMAGE_WIDTH}×${EVENT_IMAGE_HEIGHT} px`;
  readonly inputId = `image-upload-${Math.random().toString(36).slice(2, 9)}`;

  isDragging = signal(false);
  uploadProgress = signal(0);
  uploadError = signal<string | null>(null);
  private uploadSub?: Subscription;

  constructor(private cloudinary: CloudinaryService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.uploadFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadFile(file);
    input.value = ''; // allow selecting the same file again
  }

  removeImage() {
    this.uploadSub?.unsubscribe();
    this.uploading.set(false);
    this.uploadProgress.set(0);
    this.uploadError.set(null);
    this.imageUrl.set('');
  }

  private uploadFile(file: File) {
    this.uploadError.set(null);

    const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
    if (!isWebp) {
      this.uploadError.set(`"${file.name}" is not a WebP image. Only .webp files are accepted.`);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      this.uploadError.set(`The image must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`);
      return;
    }

    this.uploadSub?.unsubscribe();
    this.imageUrl.set('');
    this.uploading.set(true);
    this.uploadProgress.set(0);

    this.uploadSub = this.cloudinary.uploadImage(file).subscribe({
      next: (e) => {
        if (e.type === 'progress') {
          this.uploadProgress.set(e.percent);
        } else {
          this.imageUrl.set(e.url);
        }
      },
      error: (err: Error) => {
        this.uploading.set(false);
        this.uploadError.set(err.message);
      },
      complete: () => this.uploading.set(false),
    });
  }

  ngOnDestroy() {
    this.uploadSub?.unsubscribe();
  }
}
