import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../common/material.module';

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        ReactiveFormsModule,
        MaterialModule
    ]
})
export class LoginComponent {
    form: FormGroup;

    private fb     = inject(FormBuilder);
    private auth   = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.form = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }
    
    submit() {
        if (this.form.valid) {
            this.auth.login(this.form.value).subscribe({
                next: () => this.router.navigate(['/gateways']),
                error: err => console.error('Login failed', err)
            });
        }
    }
}
