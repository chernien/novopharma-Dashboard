import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { ConseillerComponent } from './components/conseiller/conseiller.component';
import { CommandesComponent } from './components/commandes/commandes.component';
import { ConseillerPipe } from './pipes/conseiller.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandePipe } from './pipes/commande.pipe';
import { FilterDatePipe } from './pipes/filter-date.pipe';
import { ArticlesComponent } from './components/articles/articles.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnauthComponent } from './components/unauth/unauth.component';
import { RegleComponent } from './components/regle/regle.component';
import { FactureComponent } from './components/facture/facture.component';
import { GiftComponent } from './components/gift/gift.component';
import { GiftListComponent } from './components/gift-list/gift-list.component';
import { ArticlePipe } from './pipes/article.pipe';
import { SuiviComponent } from './components/suivi/suivi.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    SideBarComponent,
    LayoutComponent,
    FooterComponent,
    LoginComponent,
    ConseillerComponent,
    CommandesComponent,
    ConseillerPipe,
    CommandePipe,
    FilterDatePipe,
    ArticlesComponent,
    NotFoundComponent,
    UnauthComponent,
    RegleComponent,
    FactureComponent,
    GiftComponent,
    GiftListComponent,
    ArticlePipe,
    SuiviComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
