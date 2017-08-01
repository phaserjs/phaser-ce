import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import pixi, p2 and phaser ce
import "pixi";
import "p2";
import * as Phaser from "phaser-ce";

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
