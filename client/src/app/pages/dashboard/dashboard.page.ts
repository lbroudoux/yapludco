import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

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
    console.log("[DashboardPageCOmponent] loadStatus() called");
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

  public getMemberBlockedStatus(member: any): number {
    var allBlocked = true;
    var atLeastOneBlocked = false;
    member.devices.forEach(device => {
      if (!device.blocked) {
        allBlocked = false;
      } else {
        atLeastOneBlocked = true;
      }
    });
    if (allBlocked) return 0;
    if (atLeastOneBlocked) return 1;
    return 2;
  }

  public enableMember(member: any): void {
    console.log("[DashboardPageCOmponent] enableMember() called for " + member.name);
    this.backendService.enableMember(member.name).subscribe(
      {
        next: res => {
          console.log("Now marking the device has non blocked");
          member.devices.forEach(device => {
            device.blocked = false;  
          });
        },
        error: err => {
          console.log("Obsever got error: " + JSON.stringify(err));
        },
        complete: () => console.log('Observer got a complete notification'),
      }
    )
  }

  public disableMember(member: any): void {
    console.log("[DashboardPageCOmponent] disableMember() called for " + member.name);
    this.backendService.disableMember(member.name).subscribe(
      {
        next: res => {
          console.log("Now marking the device has blocked");
          member.devices.forEach(device => {
            device.blocked = true;  
          });
        },
        error: err => {
          console.log("Obsever got error: " + JSON.stringify(err));
        },
        complete: () => console.log('Observer got a complete notification'),
      }
    )
  }

  public switchMemberDevice(member: any, device: any): void {
    console.log("[DashboardPageCOmponent] switchMemberDevice() called for " + device.id);
    if (device.blocked) {
      console.log("... enabling device ...");
      this.backendService.enableDevice(member.name, device).subscribe(
        {
          next: res => {
            console.log("Now marking the device has non blocked");
            device.blocked = false;
          },
          error: err => {
            console.log("Obsever got error: " + JSON.stringify(err));
          },
          complete: () => console.log('Observer got a complete notification'),
        });
    } else {
      console.log("... disabling device ...");
      this.backendService.disableDevice(member.name, device).subscribe(
        {
          next: res => {
            console.log("Now marking the device has blocked");
            device.blocked = true;
          },
          error: err => {
            console.log("Obsever got error: " + JSON.stringify(err));
          },
          complete: () => console.log('Observer got a complete notification'),
        });
    }
  }
}