'use strict';

var TypeToPriceMap = {
  flat: 1000,
  hovel: 0,
  palace: 10000
};

var RoomsMap = ['room_1', 'rooms_2', 'rooms_100'];
var GuestsMap = ['no_guests', 'guests_3', 'guests_3'];

var form = document.forms.notice__form;
var checkInOptions = form.elements.timein;
var checkOutOptions = form.elements.timeout;
var houseType = form.elements.type;
var houseMinPrice = form.elements.price;
var roomNumber = form.elements.room_number;
var capacity = form.elements.capacity;
var submitBtn = form.elements.form__submit;

checkInOptions.addEventListener('change', function () {
  checkOutOptions.value = checkInOptions.value;
});

checkOutOptions.addEventListener('change', function () {
  checkInOptions.value = checkOutOptions.value;
});

houseType.addEventListener('change', function () {
  var minPrice = TypeToPriceMap[houseType.value];
  houseMinPrice.min = minPrice;
  houseMinPrice.placeholder = minPrice;
});

roomNumber.addEventListener('change', function () {
  capacity.value = GuestsMap[roomNumber.selectedIndex];
});

capacity.addEventListener('change', function () {
  var index = GuestsMap.indexOf(capacity.value);
  roomNumber.value = RoomsMap[index];
});

submitBtn.addEventListener('click', function (evt) {
  if (form.checkValidity()) {
    form.reset();
    evt.preventDefault();
  } else {
    evt.stopPropagation();
  }
});