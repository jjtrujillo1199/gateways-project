import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';
import { MaterialModule } from '../../../common/material.module';
import { GatewayService } from '../../services/gateway.service';
import { Gateway, PaymentMethod } from '../../models/gateway.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    standalone: true,
    selector: 'app-gateway-form',
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    templateUrl: './gateway-form.component.html',
    styleUrl: './gateway-form.component.scss'
})
export class GatewayFormComponent {
    private fb          = inject(FormBuilder);
    private service     = inject(GatewayService);
    private router      = inject(Router);
    private route       = inject(ActivatedRoute);
    private authService = inject(AuthService);

    form = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        status: ['', Validators.required],
        type: ['', Validators.required],
        country: [''],
        commissionRate: [0, [Validators.min(0), Validators.max(100)]],
        methods: this.fb.array([], [this.duplicateNamesValidator, this.requiredArrayValidator])
    });

    get methods(): FormArray {
        return this.form.get('methods') as FormArray;
    }

    /**
     * Inicializa el componente cargando los detalles del gateway basado en el ID proporcionado en la ruta o si se está creando uno nuevo.
     *
     * @memberof GatewayFormComponent
     */
    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        
        if (id && id !== 'create') {
            this.service.getGateway(id).subscribe(res => {
                const g = res.data;

                this.form.patchValue({
                    id: g.id,
                    name: g.name,
                    status: g.status,
                    type: g.type,
                    country: g.country,
                    commissionRate: g.commissionRate
                });

                g.paymentMethods.forEach((m: PaymentMethod) => {
                    this.addMethod(m.name, m.commissionRate);
                });
            });
        } else {
            this.addMethod();
        }
    }

    /**
     *  Agrega un nuevo método de pago al formulario, con validación para limitar a un máximo de 5 métodos.
     *
     * @param {string} [name='']
     * @param {number} [commissionRate=0]
     * @memberof GatewayFormComponent
     */
    addMethod(name: string = '', commissionRate: number = 0) {
            if (this.methods.length < 5) {
            this.methods.push(this.fb.group({
                name: [name, Validators.required],
                commissionRate: [commissionRate, [Validators.required, Validators.min(0), Validators.max(100)]]
            }));
        }
    }

    /**
     * Elimina un método de pago del formulario basado en su índice.
     *
     * @param {number} index
     * @memberof GatewayFormComponent
     */
    removeMethod(index: number) {
        this.methods.removeAt(index);
    }

    /**
     * Valida que no existan nombres de métodos de pago duplicados en el formulario.
     *
     * @param {AbstractControl} control
     * @return {*} 
     * @memberof GatewayFormComponent
     */
    duplicateNamesValidator(control: AbstractControl) {
        const arr = control as FormArray;
        const names = arr.controls.map(c => c.get('name')?.value);
        const hasDuplicates = new Set(names).size !== names.length;
        return hasDuplicates ? { duplicateNames: true } : null;
    }

    /**
     * Valida que el formulario de métodos de pago no esté vacío, es decir, que al menos haya un método agregado.
     *
     * @param {AbstractControl} control
     * @return {*} 
     * @memberof GatewayFormComponent
     */
    requiredArrayValidator(control: AbstractControl) {
        const arr = control as FormArray;
        return arr.length === 0 ? { required: true } : null;
    }

    /**
     * Maneja el proceso de envío del formulario, validando los datos y mostrando mensajes de éxito o error según corresponda.
     *
     * @memberof GatewayFormComponent
     */
    onSubmit() {
        if (this.form.valid) {
            const gateway: Gateway = {
                id: this.form.value.id ?? '',
                name: this.form.value.name ?? '',
                status: this.form.value.status ?? '',
                type: this.form.value.type ?? '',
                country: this.form.value.country ?? '',
                commissionRate: this.form.value.commissionRate ?? 0,
                paymentMethods: (this.form.value.methods ?? []) as PaymentMethod[]
            };

            this.service.saveGateway(gateway).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Guardado!',
                        text: 'El gateway se guardó correctamente',
                        confirmButtonColor: '#3085d6'
                    });
                    this.router.navigate(['/gateways']);
                },
                error: (err) => {
                    // dividir el mensaje en varios errores
                    const errores: string[] = (err.error?.message ?? '')
                        .split(';')
                        .map((m: string) => m.trim())
                        .filter((m: string) => m.length > 0);

                    Swal.fire({
                        icon: 'error',
                        title: 'Errores de validación',
                        html: `<ul style="text-align: left; list-style-position: inside;">${errores.map((e: string) => `<li>${e}</li>`).join('')}</ul>`,
                        confirmButtonColor: '#d33'
                    });
                }
            });
        } else {
            const invalidControls = Object.keys(this.form.controls)
                .filter(key => this.form.get(key)?.invalid);

            Swal.fire({
                icon: 'warning',
                title: 'Formulario inválido',
                html: `<ul>${invalidControls.map(c => `<li>${c}</li>`).join('')}</ul>`,
                confirmButtonColor: '#f39c12'
            });
        }
    }

    onLogout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
