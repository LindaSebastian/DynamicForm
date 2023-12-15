import { Component, ViewChild } from '@angular/core';
import { FormServiceService } from './service/form-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formData: any;
  formFields: any[]= [];
  dynamicFormValue: any[] = [];
  checkValid : boolean = false;
  @ViewChild(EmployeeFormComponent) employeeForm! : EmployeeFormComponent;
  constructor(private formService : FormServiceService,
              private fb: FormBuilder){
  }

  ngOnInit(){
    this.formData = this.formService.getFormData();
    this.formFields = this.formData.formFields;
  }

  getFormInfo(e: any){
    this.dynamicFormValue.push(e);
  }

  checkValidity(e: any) {
    this.checkValid = e.invalid;
  }

  reset() {
    this.employeeForm.resetForm()
  }

  submitForm(){
    console.log("form",this.dynamicFormValue);
  }
}
