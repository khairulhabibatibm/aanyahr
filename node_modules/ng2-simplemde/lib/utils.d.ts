import { ControlValueAccessor } from '@angular/forms';
export declare class NgModelBase implements ControlValueAccessor {
    onTouchedCallback: () => {};
    onChangeCallback: (_: any) => {};
    _innerValue: any;
    value: any;
    writeValue(v: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
}
