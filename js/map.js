'use strict';

var tokioMap = document.querySelector('.tokyo__pin-map');

var fragment = document.createDocumentFragment();
window.data.forEach(function (elem) {
  fragment.appendChild(window.pin.renderPin(elem));
});
tokioMap.appendChild(fragment);
