import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const CLOUD_NAME = 'ellgibqg';
const UPLOAD_PRESET = 'event_images';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// Event images are shown at 800x450 px (16:9), which is also the recommended upload resolution.
// Unsigned uploads can't send a `transformation` param, so the resize is applied in the delivery URL:
// c_fill crops to exactly 800x450 and g_auto keeps the most important part of the image centered.
export const EVENT_IMAGE_WIDTH = 800;
export const EVENT_IMAGE_HEIGHT = 450;
const EVENT_IMAGE_TRANSFORMATION = `c_fill,g_auto,w_${EVENT_IMAGE_WIDTH},h_${EVENT_IMAGE_HEIGHT}`;

/** Inserts the 800x450 transformation into a Cloudinary URL: .../upload/<transformation>/v123/id.webp */
function withEventTransformation(url: string): string {
  return url.replace('/image/upload/', `/image/upload/${EVENT_IMAGE_TRANSFORMATION}/`);
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
          subscriber.next({ type: 'done', url: withEventTransformation(response.secure_url) });
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
