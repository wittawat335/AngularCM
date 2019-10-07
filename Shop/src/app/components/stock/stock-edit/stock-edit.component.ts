import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrls: ['./stock-edit.component.css']
})
export class StockEditComponent implements OnInit {

  mProduct: Product;
  imageSrc: ArrayBuffer | string = null;
  mIsSubmitted = false;


  constructor(private activatedRoute: ActivatedRoute,
              private restService: RestApiService,
              private location: Location) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      params => {
        console.log(params.id);
        this.feedData(params.id);
      },
      error => {
        alert(error.toString());
      }
    );
  }

  feedData(id: any) {
    this.restService.getProduct(id).subscribe(
      data => {
        // console.log(data.result);
        this.mProduct = data.result;
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  submit() {
    console.log(JSON.stringify(this.mProduct));

    this.restService
      .editProduct(this.mProduct.ProductId, this.mProduct, )
      .subscribe(
        data => {
          alert(data.message);

          this.mIsSubmitted = true;
          this.location.back();
        }
      );
  }

  cancel() {
    this.location.back();
  }

  onUploadImage(event) {
    const metaImage = event.target.files[0];

    if (metaImage) {
      const reader = new FileReader();
      reader.readAsDataURL(metaImage);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.mProduct.Image = metaImage;
        console.log(this.mProduct.Image);
      };
    }
  }

}
