var $ = require("jquery");

var globalWidgetCallback;

function globalWidget() {
  return globalWidgetCallback.apply(null, arguments);
}

$.fn.languageDT = function () {
  return {
    decimal: ",",
    thousands: " ",
    processing: "Подождите...",
    search: "Поиск:",
    lengthMenu: "Показать _MENU_ записей",
    info: "Записи с _START_ по _END_ из _TOTAL_",
    infoEmpty: "Записи с 0 до 0 из 0",
    infoFiltered: "(всего _MAX_)",
    infoPostFix: "",
    loadingRecords: "Загрузка записей...",
    zeroRecords: "Записи отсутствуют.",
    emptyTable: "В таблице отсутствуют данные",
    paginate: {
      first: "<<",
      previous: "<",
      next: ">",
      last: ">>",
    },
    aria: {
      sortAscending: ": активировать для сортировки столбца по возрастанию",
      sortDescending: ": активировать для сортировки столбца по убыванию",
    },
  };
};
$.fn.languageDR = function () {
  return {
    applyLabel: "Принять",
    cancelLabel: "Отмена",
    monthNames: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    invalidDateLabel: "Выберите дату",
    firstDay: 1,
    daysOfWeek: ["Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "Пн"],
    format: "DD.MM.YYYY",
  };
};
$.fn.languageCH = function () {
  return {
    loading: "Загрузка...",
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    weekdays: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ],
    shortMonths: [
      "Янв",
      "Фев",
      "Март",
      "Апр",
      "Май",
      "Июнь",
      "Июль",
      "Авг",
      "Сент",
      "Окт",
      "Нояб",
      "Дек",
    ],
    exportButtonTitle: "Экспорт",
    printButtonTitle: "Печать",
    rangeSelectorFrom: "С",
    rangeSelectorTo: "По",
    rangeSelectorZoom: "Период",
    downloadPNG: "Скачать PNG",
    downloadJPEG: "Скачать JPEG",
    downloadPDF: "Скачать PDF",
    downloadSVG: "Скачать SVG",
    printChart: "Напечатать график",
  };
};
module.exports = globalWidget;
