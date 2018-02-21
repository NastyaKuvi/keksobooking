'use strict';
window.offerDialog = (function () {
  var HIDDEN = 'hidden';

  var lodgetemplate = document.querySelector('#lodge-template').content;
  var offerDialog = document.querySelector('#offer-dialog');
  var offerDialogTitle = offerDialog.querySelector('.dialog__title');
  var offerDialogImg = offerDialogTitle.querySelector('img');
  var offerDialogClose = offerDialogTitle.querySelector('.dialog__close');
  var callback = null;

  var hide = function () {
    offerDialog.classList.add(HIDDEN);

    if (typeof callback === 'function') {
      callback();
    }
  };

  var show = function () {
    if (offerDialog.classList.contains(HIDDEN)) {
      offerDialog.classList.remove(HIDDEN);
      document.addEventListener('keydown', escKeyDownHandler);
    }
  };

  var escKeyDownHandler = function (evt) {
    if (window.utils.isEscKeyHandler(evt)) {
      hide();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  offerDialogClose.addEventListener('click', function () {
    hide();
  });

  var renderLodgeElement = function (offer) {
    var lodgeElement = lodgetemplate.cloneNode(true);
    lodgeElement.querySelector('.lodge__title').textContent = offer.title;
    lodgeElement.querySelector('.lodge__address').textContent = offer.address();
    lodgeElement.querySelector('.lodge__price').innerHTML = offer.price + ' &#x20bd;/ночь';
    lodgeElement.querySelector('.lodge__type').textContent = offer.type;
    lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + offer.guests + ' гостей в ' + offer.rooms + ' комнатах';
    lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
    for (var i = 0; i < offer.features.length; i++) {
      var span = '<span class="feature__image feature__image--' + offer.features[i] + '">';
      lodgeElement.querySelector('.lodge__features').insertAdjacentHTML('afterbegin', span);
    }
    lodgeElement.querySelector('.lodge__description').textContent = offer.description;
    return lodgeElement;
  };

  return function (data, cb) {
    callback = cb;
    offerDialogImg.setAttribute('src', data.author.avatar);
    offerDialog.replaceChild(renderLodgeElement(data.offer), offerDialog.querySelector('.dialog__panel'));
    show();
  };
})();
