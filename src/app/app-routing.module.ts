import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectivePreloadingStrategy } from './selective.preloading';

const routes: Routes = [
  //{ path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule),
    data: {
      preload: true
    },
  },
  { path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    data: {
      preload: true
    },
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'schedule-editor',
    loadChildren: () => import('./pages/features/schedule-editor/schedule-editor.module').then( m => m.ScheduleEditorPageModule)
  },
  {
    path: 'heatmap',
    loadChildren: () => import('./pages/features/heatmap/heatmap.module').then( m => m.HeatmapPageModule)
  },
  {
    path: 'vacant-venue',
    loadChildren: () => import('./pages/features/vacant-venue/vacant-venue.module').then( m => m.VacantVenuePageModule)
  },
  {
    path: 'fee-details',
    loadChildren: () => import('./pages/features/fee-details/fee-details.module').then( m => m.FeeDetailsPageModule)
  },
  {
    path: 'gp-play',
    loadChildren: () => import('./pages/features/gp-play/gp-play.module').then( m => m.GpPlayPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/features/settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  providers: [SelectivePreloadingStrategy],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: SelectivePreloadingStrategy  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
