import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const CLOUD_NAME = 'ellgibqg';
const UPLOAD_PRESET = 'event_images';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Organizers upload a BANNER (1920x600). That is the "original" image shown full width on the event page.
 * The 16:9 CARD version (800x450) used in lists is cut from the same file by Cloudinary.
 *
 * Unsigned uploads can't send a `transformation` param, so sizes are applied in the delivery URL:
 * c_fill crops to the exact size and g_auto keeps the most important part of the image.
 */
export const EVENT_BANNER_WIDTH = 1920;
export const EVENT_BANNER_HEIGHT = 600;
export const EVENT_CARD_WIDTH = 800;
export const EVENT_CARD_HEIGHT = 450;

export type EventImageSize = 'banner' | 'card';

const TRANSFORMATIONS: Record<EventImageSize, string> = {
  banner: `c_fill,g_auto,w_${EVENT_BANNER_WIDTH},h_${EVENT_BANNER_HEIGHT}`,
  card: `c_fill,g_auto,w_${EVENT_CARD_WIDTH},h_${EVENT_CARD_HEIGHT}`,
};

const UPLOAD_SEGMENT = '/image/upload/';

/**
 * Returns the Cloudinary URL of the image at the requested size.
 * Any previous transformation in the URL is replaced (e.g. old 800x450 URLs become banners).
 * Non-Cloudinary URLs are returned unchanged.
 */
export function eventImageUrl(url: string | null | undefined, size: EventImageSize): string {
  if (!url) return '';
  const index = url.indexOf(UPLOAD_SEGMENT);
  if (!url.includes('res.cloudinary.com') || index === -1) return url;

  const base = url.slice(0, index + UPLOAD_SEGMENT.length);
  // Drop existing transformation segments (they come before the "v123" version or the public id)
  const parts = url.slice(base.length).split('/');
  while (parts.length > 1 && /^[a-z]{1,3}_/.test(parts[0]) && !/^v\d+$/.test(parts[0])) {
    parts.shift();
  }
  return `${base}${TRANSFORMATIONS[size]}/${parts.join('/')}`;
}

export type UploadEvent =
  | { type: 'progress'; percent: number }
  | { type: 'done'; url: string };

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  /**
   * Uploads an image straight from the browser to Cloudinary (unsigned preset).
   * The returned URL is the banner version (1920x600), which is what gets saved in the event.
   * Uses XMLHttpRequest instead of HttpClient so we get upload progress
   * (HttpClient with fetch can't report it) and the app's JWT interceptor
   * never sends our token to a third-party service.
   */
  uploadImage(file: File): Observable<UploadEvent> {
    return new Observable<UploadEvent>((subscriber) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_URL);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          subscriber.next({ type: 'progress', percent: Math.round((e.loaded / e.total) * 100) });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          subscriber.next({ type: 'done', url: eventImageUrl(response.secure_url, 'banner') });
          subscriber.complete();
        } else {
          let message = 'Upload failed. Please try again.';
          try {
            message = JSON.parse(xhr.responseText)?.error?.message ?? message;
          } catch {}
          subscriber.error(new Error(message));
        }
      };

      xhr.onerror = () => subscriber.error(new Error('Network error while uploading the image.'));

      xhr.send(formData);

      // Abort the upload if the subscriber goes away (e.g. user leaves the page)
      return () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) xhr.abort();
      };
    });
  }
}
