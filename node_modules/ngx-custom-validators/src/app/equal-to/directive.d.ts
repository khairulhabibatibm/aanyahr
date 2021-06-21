import { OnInit } from '@angular/core';
import { Validator, FormControl, AbstractControl } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare class EqualToValidator implements Validator, OnInit {
    equalTo: FormControl;
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    static ɵfac: ɵngcc0.ɵɵFactoryDef<EqualToValidator, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<EqualToValidator, "[equalTo][formControlName],[equalTo][formControl],[equalTo][ngModel]", never, { "equalTo": "equalTo"; }, {}, never>;
}

//# sourceMappingURL=directive.d.ts.map