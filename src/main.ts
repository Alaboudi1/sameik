import { Aurelia, PLATFORM } from 'aurelia-framework';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

export function configure(aurelia: Aurelia) {

  OfflinePluginRuntime.install({
    onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
    onUpdated: () => location.reload(),
  });
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}