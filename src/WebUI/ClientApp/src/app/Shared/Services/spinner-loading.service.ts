import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class SpinnerLoadingService {
  constructor(private spinner: NgxSpinnerService) {}
  Show() {
    this.spinner.show();
  }
  Hide() {
    this.spinner.hide();
  }
}
