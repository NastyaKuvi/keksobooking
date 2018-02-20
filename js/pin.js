'use strict';
window.pin = (function () {
  var ACTIVE = 'pin--active';

  var PinSize = {
    WIDTH: 56,
    HEIGHT: 75
  };

  var activePin = null;

  var setActivePin = function (curPin) {
    if (curPin !== null && activePin !== curPin) {
      activePin = curPin;
      curPin.classList.add(ACTIVE);
    }
  };

  var unsetActivePin = function () {
    if (activePin !== null) {
      activePin.classList.remove(ACTIVE);
    }
  };

  var changeActivePin = function (curActivePin) {
    unsetActivePin();
    setActivePin(curActivePin);
  };

  var pinActivationHandler = function (newPin, data) {
    changeActivePin(newPin);
    window.offerDialog(data, unsetActivePin);
  };

  return {
    renderPin: function (dataElem) {
      var resElement = document.createElement('div');
      resElement.classList.add('pin');
      resElement.tabIndex = 0;
      resElement.style.left = (dataElem.location.x - PinSize.WIDTH / 2) + 'px';
      resElement.style.top = (dataElem.location.y - PinSize.HEIGHT) + 'px';
      var imgElement = '<img src="' + dataElem.author.avatar + '" class="rounded" width="40" height="40">';
      resElement.insertAdjacentHTML('afterbegin', imgElement);

      resElement.addEventListener('click', function (evt) {
        pinActivationHandler(evt.currentTarget, dataElem);
      });

      resElement.addEventListener('keydown', function (evt) {
        if (window.utils.isEnterKeyHandler(evt)) {
          pinActivationHandler(evt.currentTarget, dataElem);
        }
      });
      return resElement;
    }
  };
})();
