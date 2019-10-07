import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ProductForm } from 'src/app/models/product-view-model';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.css']
})
export class StockCreateComponent implements OnInit {

  mProduct: ProductForm;
  imageSrc: ArrayBuffer | string = null;
  mIsSubmitted = false;

  constructor(private activatedRoute: ActivatedRoute,
              private service: RestApiService,
              private location: Location) { }

  ngOnInit() {
    this.mProduct = new ProductForm();
  }

  submit() {
    console.log(JSON.stringify(this.mProduct));

    this.service
      .addProduct(this.mProduct)
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
        this.mProduct.image = metaImage;
        console.log(this.mProduct.image);
      };
    }
  }

}
