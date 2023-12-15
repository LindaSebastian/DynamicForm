import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControls, Validations } from '../interface/common';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  providers:[FormBuilder]
})
export class EmployeeFormComponent implements OnInit {
  @Input() label:string = "";
  @Input() fields: any[] = [];
  @Output('setForm') setForm:EventEmitter<any> = new EventEmitter<any>();
  @Output('checkValid') checkValid:EventEmitter<any> = new EventEmitter<any>();

  // private fb = Inject(FormBuilder);
  constructor(private fb : FormBuilder){}
  dynamicForm : FormGroup = this.fb.group({});


  // ngOnChanges(){
  //   console.log(this.label);
  // }

  ngOnInit() {
    if(this.fields) {
      let formGrp: any = {};
      this.fields.forEach((control : FormControls) => {
        let controlValidator : any[] = [];
        if(control.validations) {
          for(let val in control.validations) {
              if(val == 'isRequired' && control.validations['isRequired']) controlValidator.push(Validators.required);
               if(val === 'pattern' ) {
                let pattern = control.validations['pattern'] || '';
                controlValidator.push(Validators.pattern(pattern));
               }
          }
        }
        if(control.type == 'radio') {
          formGrp[control.name] = [false]
        } else if(control.type == 'checkbox'){
          console.log(control);
          formGrp[control.name] = this.fb.array([])
        }
        else {
          formGrp[control.name] = [control.value || '', controlValidator]
        } 
      }
      );

      this.dynamicForm = this.fb.group(formGrp);
    }
    this.checkValid.emit(this.dynamicForm);

    this.dynamicForm.valueChanges.subscribe((ele)=>{
      console.log(ele);
      console.log(this.dynamicForm);
    });
  }

  // checkBoxOpt(control : FormControls, validator ?: any) {
  //   let formGRP: any = {};
  //   control?.options?.forEach((ele)=>{
  //     formGRP[ele.value] = new FormControl('',validator)
  //   });
  //   return new FormGroup(formGRP);
  // }

  checkBoxOpt(e: any, control: FormControls) {
    let chkForm = this.dynamicForm.get(control.name) as FormArray;
    console.log(e);
    if(e.target.checked){
      chkForm.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      chkForm.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          chkForm.removeAt(i);
          return;
        }
        i++;
      });
    }
    // const arr = control?.options?.map(opt => {
    //   return this.fb.control(opt.value);
    // });
    // return this.fb.array(arr);
  }

  onSubmit(){
    this.setForm.emit(this.dynamicForm.controls);
  }

  getValidationErr(control:FormControls) {
    let formC = this.dynamicForm.get(control.name);
    let errorM = "";
    for(let val in control.validations) {
      if(control.validations['isRequired'] && formC?.touched && !formC.value){
        errorM = `${control.label} is required`;
      } else if(control.validations['pattern'] && formC?.touched && formC.errors?.['pattern']){
        errorM = `${control.label} is invalid`;
      }
    }
    return errorM;
  }

  setRequiredField(control:FormControls) {
    let formC = this.dynamicForm.get(control.name);
    let reqF = false;
    for(let val in control.validations) {
      if(control.validations['isRequired']){
        reqF = true
      }
    }
    return reqF;
  }

  resetForm(){
    this.dynamicForm.reset();
  }
}
