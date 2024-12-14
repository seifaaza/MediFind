import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceSpaces',
  standalone: true, // Mark the pipe as standalone
})
export class ReplaceSpacesPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\s+/g, '-');
  }
}
