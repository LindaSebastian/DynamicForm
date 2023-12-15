export interface FormControls {
    type: string;
    label: string;
    name: string;
    value?: string;
    options?: Option[];
    validations: Validations;
}
  
export interface Option {
  label: string;
  value: string;
}
  
export interface Validations {
  isRequired: boolean;
  pattern?: undefined;
}
  