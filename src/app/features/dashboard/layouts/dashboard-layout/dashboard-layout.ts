import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Navbar } from "../navbar/navbar";
import { RouterOutlet } from "@angular/router";
import { TfToast } from "../../../../shared/components/tf-toast/tf-toast";

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar, Navbar, RouterOutlet, TfToast],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}
