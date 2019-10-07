import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { RestApiService } from '../services/rest-api.service';

@Pipe({
  name: 'imageSecure'
})
export class ImagePipe implements PipeTransform {

  constructor(private restService: RestApiService) {}

  transform(name: string): any {
    return new Observable<string | ArrayBuffer>((observer) => {
      // This is a tiny blank image
      observer.next('assets/images/cmdev_logo.png');

      this.restService.getProductImage(name).subscribe(response => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          observer.next(reader.result);
        };
      });
      return { unsubscribe() { } };
    });

  }
  }


