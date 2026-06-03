import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { ConseillerComponent } from './components/conseiller/conseiller.component';
import { CommandesComponent } from './components/commandes/commandes.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthComponent } from './components/unauth/unauth.component';
import { RegleComponent } from './components/regle/regle.component';
import { FactureComponent } from './components/facture/facture.component';
import { GiftComponent } from './components/gift/gift.component';
import { GiftListComponent } from './components/gift-list/gift-list.component';
import { SuiviComponent } from './components/suivi/suivi.component';

const routes: Routes = [
  { path: '', component: LoginComponent },

  {
    path: 'home', canActivate: [AuthGuard], component: HomeComponent, children: [
      { path: '', component: LayoutComponent },
      { path: 'conseiller', component: ConseillerComponent },
      { path: 'commandes', component: CommandesComponent },
      { path: 'article', component: ArticlesComponent },
      { path: 'facture', component: FactureComponent },
      { path: 'gift', component: GiftComponent },
      { path: 'gift-list', component: GiftListComponent },
      { path: 'suivi', component: SuiviComponent },


    ]
  },
  { path: 'confidentialite', component: RegleComponent },
  { path: 'unauth', component: UnauthComponent },
  { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
