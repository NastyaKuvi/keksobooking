'use strict';

var PIN_WIDTH = 56;
var PIN_HEIGHT = 75;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIMES_CHEKC_IN_OUT = ['12:00', '13:00', '14:00'];
var TYPES = [{type: 'flat', name: 'Квартира'},
             {type: 'house', name: 'Дом'},
             {type: 'bungalo', name: 'Бунгало'}];
var TITLE_VALUES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var CopyOfTitles = TITLE_VALUES.slice();

var tokioMap = document.querySelector('.tokyo__pin-map');
var lodgetemplate = document.querySelector('#lodge-template').content;
var offerDialog = document.querySelector('#offer-dialog');
var dialogPanel = offerDialog.querySelector('.dialog__panel');

var getCorrectStringNumber = function (number) {
  return number > 9 ? number : '0' + number;
};

var getRandomNumder = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getUnicTitle = function () {
  var index = getRandomNumder(0, CopyOfTitles.length - 1);
  return CopyOfTitles.splice(index, 1)[0];
};

var getType = function () {
  var index = getRandomNumder(0, TYPES.length - 1);
  return TYPES[index].type;
};

var getTime = function () {
  var index = getRandomNumder(0, TIMES_CHEKC_IN_OUT.length - 1);
  return TIMES_CHEKC_IN_OUT[index];
};

var getUnicFeatures = function (length) {
  var resultFeatures = [];
  var CopyOfFeatures = FEATURES.slice();
  for (var i = 0; i < length; i++) {
    var feature = CopyOfFeatures.splice(getRandomNumder(0, CopyOfFeatures.length - 1), 1)[0];
    resultFeatures.push(feature);
  }
  return resultFeatures;
};

var createData = function (count) {
  var resultdata = [];
  for (var i = 0; i < count; i++) {
    var object = {
      author: {
        avatar: 'img/avatars/user' + getCorrectStringNumber(i + 1) + '.png'
      },
      offer: {
        title: getUnicTitle(),
        address: function () {
          return object.location.x + ', ' + object.location.y;
        },
        price: getRandomNumder(1000, 1000000),
        type: getType(),
        rooms: getRandomNumder(1, 5),
        guests: getRandomNumder(1, 10),
        checkin: getTime(),
        checkout: getTime(),
        features: getUnicFeatures(getRandomNumder(0, FEATURES.length)),
        description: '',
        photos: []
      },
      location: {
        x: getRandomNumder(300, 900),
        y: getRandomNumder(100, 500)
      }
    };

    resultdata.push(object);
  }
  return resultdata;
};

var createPin = function (data) {
  var resElement = document.createElement('div');
  resElement.classList.add('pin');
  resElement.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
  resElement.style.top = (data.location.y - PIN_HEIGHT) + 'px';
  var htmlString = '<img src="' + data.author.avatar + '" class="rounded" width="40" height="40">';
  resElement.insertAdjacentHTML('afterbegin', htmlString);

  return resElement;
};

var getTypeName = function (type) {
  switch (type) {
    case TYPES[0].type:
      return TYPES[0].name;
    case TYPES[1].type:
      return TYPES[1].name;
    case TYPES[2].type:
      return TYPES[2].name;
    default:
      return '';
  }
};

var createLodgeElement = function (offer) {
  var lodgeElement = lodgetemplate.cloneNode(true);
  lodgeElement.querySelector('.lodge__title').textContent = offer.title;
  lodgeElement.querySelector('.lodge__address').textContent = offer.address();
  lodgeElement.querySelector('.lodge__price').innerHTML = offer.price + ' &#x20bd;/ночь';
  lodgeElement.querySelector('.lodge__type').textContent = getTypeName(offer.type);
  lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + offer.guests + ' гостей в ' + offer.rooms + ' комнатах';
  lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после' + offer.checkin + ', выезд до ' + offer.checkout;
  for (var i = 0; i < offer.features.length; i++) {
    var span = '<span class="feature__image feature__image--' + offer.features[i] + '">';
    lodgeElement.querySelector('.lodge__features').insertAdjacentHTML('afterbegin', span);
  }
  lodgeElement.querySelector('.lodge__description').textContent = offer.description;
  return lodgeElement;
};

var createNewOffer = function (data) {
  offerDialog.querySelector('.dialog__title').querySelector('img').setAttribute('src', data.author.avatar);
  offerDialog.replaceChild(createLodgeElement(data.offer), dialogPanel);
};

var data = createData(8);
var fragment = document.createDocumentFragment();
for (var i = 0; i < data.length; i++) {
  fragment.appendChild(createPin(data[i]));
}
tokioMap.appendChild(fragment);
createNewOffer(data[0]);

