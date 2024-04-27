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

module.exports = globalWidget;
