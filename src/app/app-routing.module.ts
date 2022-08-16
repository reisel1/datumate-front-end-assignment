import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GcpComponent } from './views/gcp/gcp.component';

const routes: Routes = [
  {  path: '', component: GcpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
