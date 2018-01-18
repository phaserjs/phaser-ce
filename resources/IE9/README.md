xhrLoadWithXDR
==============

This should be used _only_ for loading cross-domain assets on IE 9. Phaser does not support IE 8 and XDomainRequest is deprecated in IE 10.

Include this script after phaser.js, then use, e.g.,

```javascript
function preload () {
    this.game.load.useXDomainRequest = (this.game.device.ieVersion === 9);
    // Load assets as usual …
}
```
