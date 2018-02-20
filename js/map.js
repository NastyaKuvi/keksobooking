'use strict';

var DATA_LENGTH = 8;
var tokioMap = document.querySelector('.tokyo__pin-map');

var fragment = document.createDocumentFragment();
window.data.create(DATA_LENGTH).forEach(function (elem) {
  fragment.appendChild(window.pin.renderPin(elem));
});
tokioMap.appendChild(fragment);
