import { Pipe, PipeTransform } from '@angular/core';
import { EventImageSize, eventImageUrl } from '../services/cloudinary';

/**
 * Picks the right size of an event image.
 * Usage: [src]="event.imageUrl | eventImage: 'card'"   (800x450, lists and cards)
 *        [src]="event.imageUrl | eventImage: 'banner'" (1920x600, event page hero)
 */
@Pipe({
  name: 'eventImage',
})
export class EventImagePipe implements PipeTransform {
  transform(url: string | null | undefined, size: EventImageSize = 'card'): string {
    return eventImageUrl(url, size);
  }
}
