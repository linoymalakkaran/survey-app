import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Directive({
  selector: '[forRoles]'
})
export class ForRolesDirective {

  roles: string[];
  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService) { }

  @Input()
  set forRoles(roles: string[] | string) {
    if (roles != null) {
      this.roles = Array.isArray(roles) ? roles : [roles];
      this.roles = this.roles.map(r => r.toUpperCase());
    } else {
      this.roles = [];
    }

    this.authService.getUserRole$().subscribe(
      role => {
        if (role && !this.roles.includes(role.roleName.toUpperCase())) {
          this.viewContainer.clear();
        } else {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      }
    );
  }

}
