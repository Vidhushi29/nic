import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginHomeComponent } from './common/login-home/login-home.component';
import { LoginComponent } from './login/login.component';
import { WebLoginComponent } from './web-login/web-login.component';
import { SeednetLoginComponent } from './seednet-login/seednet-login.component';
import { InspectionReportComponent } from './main-app/inspection-report/inspection-report.component';
import * as CryptoJS from 'crypto-js';
import { TraceTagComponent } from './trace-tag/trace-tag.component';
import { BspTwoSecondReportComponent } from './main-app/bsp-two-second-report/bsp-two-second-report.component';
import { BspProformaOneReportQrComponent } from './main-app/breeder-form/bsp-proforma-one-report-qr/bsp-proforma-one-report-qr.component';
import { ProcessedRegisterOldStockComponent } from './processed-register-old-stock/processed-register-old-stock.component';
import { GenerateInvoiceQrComponent } from './generate-invoice-qr/generate-invoice-qr.component';
import { BreederSeedCertificateQrComponent } from './breeder-seed-certificate-qr/breeder-seed-certificate-qr.component';
import { BillReceiptQrComponent } from './bill-receipt-qr/bill-receipt-qr.component';
import { GenerateCardQrComponent } from './generate-card-qr/generate-card-qr.component';
import { TagNumberVerificationQrComponent } from './tag-number-verification-qr/tag-number-verification-qr.component';

import { MobileAppComponent } from './mobile-app/mobile-app.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'KISAAN/app',
    component: MobileAppComponent
  },
  {
    path: 'tracetagMH',
    component: TraceTagComponent
  },
  {
    path: 'inspection-report/:encryptedData',
    component: InspectionReportComponent,
  },
  {
    path: 'bsp-two-second-report/:encryptedData',
    component: BspTwoSecondReportComponent,
  },
  {
    path: 'breeder-bsp-profarma-one-qr/:encryptedData',
    component: BspProformaOneReportQrComponent,
  },
  {
    path: 'generate-invoice-qr/:submissionid',
    component: GenerateInvoiceQrComponent,
  },

  {
    path: 'verification-bill/:id',
    component: BillReceiptQrComponent
  },
  {
    path: 'verification-certificate/:id',
    component: BreederSeedCertificateQrComponent
  },
  
  
  {
    path: 'web-login',
    component: WebLoginComponent
  },
  {
    path: 'seednet-login',
    component: SeednetLoginComponent
  },

  {
    path: '',
    component: WebLoginComponent
  },
  {
    path: 'login-home',
    component: LoginHomeComponent
  },
  {
    path: 'ProcessedRegisterOldStock',
    component: ProcessedRegisterOldStockComponent
  }, 
  {
    path: 'generate-card/:id',
    component: GenerateCardQrComponent
  },
  {
    path: 'tag-number-verification',
    component: TagNumberVerificationQrComponent
  },
  {
    path: '',
    loadChildren: () => import('./main-app/main-app.module')
      .then(m => m.MainAppModule),
  },


  {
    path: '**',
    redirectTo: 'web-login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
