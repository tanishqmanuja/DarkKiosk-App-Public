import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SuperTabsModule } from '@ionic-super-tabs/angular'
import { WebkioskService } from './services/webkiosk.service'
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AtatService } from './services/atat.service';
import { UtilService } from './services/util.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AttendanceDetailsPageModule } from './pages/attendance-details/attendance-details.module';
import { FcmService } from './services/fcm.service';
import { NavAnimation } from './animations/nav.animation';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: NavAnimation
    }),
    AppRoutingModule,
    SuperTabsModule.forRoot(),
    NgCircleProgressModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AttendanceDetailsPageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    WebkioskService,
    AtatService,
    UtilService,
    FcmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
