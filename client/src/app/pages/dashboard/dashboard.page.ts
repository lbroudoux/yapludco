import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/auth.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: "dashboard-page",
  templateUrl: "dashboard.page.html",
  styleUrls: ["dashboard.page.css"]
})
export class DashboardPageComponent implements OnInit {

  private username: string;
  private password: string;
  private membersStatus: any[];

  constructor(protected authService: AuthenticationService, protected backendService: BackendService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadStatus();
    }
  }

  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  public login(): void{
    console.log("[DashboardPageCOmponent] login() called with " + this.username);
    this.authService.login(this.username, this.password).subscribe(
      {
        next: res => {
          this.authService.notifyLoginSuccessfull(this.username, this.password);
          this.loadStatus();
        },
        error: err => {
          console.log("Obsever got error: " + JSON.stringify(err));
        },
        complete: () => console.log('Observer got a complete notification'),
      });
  }

  public logout(): void {
    console.log("[DashboardPageCOmponent] logout() called");
    this.authService.logout();
  }

  public refresh(): void {
    console.log("[DashboardPageCOmponent] refresh() called");
    document.location.reload();
    //this.loadStatus();
  }

  private loadStatus(): void {
    this.backendService.getStatus().subscribe(
      {
        next: res => {
          this.membersStatus = res;
        },
        error: err => {
          console.log("Obsever got error: " + JSON.stringify(err));
        },
        complete: () => console.log('Observer got a complete notification'),
      });
  }
}