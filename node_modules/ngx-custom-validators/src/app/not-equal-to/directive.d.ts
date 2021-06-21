import { OnInit } from '@angular/core';
import { Validator, FormControl, AbstractControl } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare class NotEqualToValidator implements Validator, OnInit {
    notEqualTo: FormControl;
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NotEqualToValidator, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NotEqualToValidator, "[notEqualTo][formControlName],[notEqualTo][formControl],[notEqualTo][ngModel]", never, { "notEqualTo": "notEqualTo"; }, {}, never>;
}

//# sourceMappingURL=directive.d.ts.map