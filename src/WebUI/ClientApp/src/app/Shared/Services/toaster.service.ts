import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ToasterService {
  constructor(private toastr: ToastrService) {}

  Success(title: string, message: string) {
    this.toastr.success(title, message, {
      timeOut: 10000,
      positionClass: "toast-top-center",
    });
  }
  Error(title: string, message: string) {
    this.toastr.error(title, message, {
      timeOut: 10000,
      positionClass: "toast-top-center",
    });
  }
  Info(title: string, message: string) {
    this.toastr.info(title, message, {
      timeOut: 10000,
      positionClass: "toast-top-center",
    });
  }
  Warning(title: string, message: string) {
    this.toastr.warning(title, message);
  }
}
