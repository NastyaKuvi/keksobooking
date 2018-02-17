'use strict';
window.data = (function() {
  var DataMap = {
    DATA_LENGTH: 8,
    TIMES_CHEKC_IN_OUT: ['12:00', '13:00', '14:00'],
    OFFER_TYPES: ['flat', 'house', 'bungalo'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']
  };

  var TYPES_MAP = {flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};

  var getRandomNumber = window.utils.getRandomNumber;
  var getRandomItem = window.utils.getRandomItem;
  var shuffleArray = window.utils.shuffleArray;

  var formatUserNumber = function (number) {
    return number > 9 ? number : '0' + number;
  };

  var getUnicFeatures = function () {
    var length = getRandomNumber(0, DataMap.FEATURES.length);
    return shuffleArray(DataMap.FEATURES).slice(0, length + 1);
  };

  var createData = function (count) {
    var shuffledTitles = shuffleArray(DataMap.TITLES);
    var resultdata = [];

    for (var i = 0; i < count; i++) {
      var object = {
        author: {
          avatar: 'img/avatars/user' + formatUserNumber(i + 1) + '.png'
        },
        offer: {
          title: shuffledTitles[i],
          address: function () {
            return object.location.x + ', ' + object.location.y;
          },
          price: getRandomNumber(1000, 1000000),
          type: TYPES_MAP[getRandomItem(DataMap.OFFER_TYPES)],
          rooms: getRandomNumber(1, 5),
          guests: getRandomNumber(1, 10),
          checkin: getRandomItem(DataMap.TIMES_CHEKC_IN_OUT),
          checkout: getRandomItem(DataMap.TIMES_CHEKC_IN_OUT),
          features: getUnicFeatures(),
          description: '',
          photos: []
        },
        location: {
          x: getRandomNumber(300, 900),
          y: getRandomNumber(100, 500)
        }
      };

      resultdata.push(object);
    }
    return resultdata;
  };

  return createData(DataMap.DATA_LENGTH).sort(function (a, b) {
    return a.location.y - b.location.y;
  });
})();
