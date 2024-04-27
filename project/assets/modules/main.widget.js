// css modules
require("font-awesome/css/font-awesome.min.css");
require("bootstrap/dist/css/bootstrap.min.css");
require("datatables.net-bs5/css/dataTables.bootstrap5.min.css");
require("select2/dist/css/select2.min.css");
require("select2-bootstrap-5-theme/dist/select2-bootstrap-5-theme.min.css");
require("bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css");
require("daterangepicker/daterangepicker.css");
// css custom
require("../css/main.css");
// js modules
var bootstrap = require("bootstrap");
require("jquery");
require("jquery-ui");
require("datatables.net-bs5");
require("jquery.cookie");
require("select2");
require("select2/dist/js/i18n/ru.js");
require("django-select2");
require("bootstrap-datepicker");
require("bootstrap-datepicker/dist/locales/bootstrap-datepicker.ru.min.js");
require("daterangepicker");
// js custom
require("../modules/global_constant.js");

/*jslint evil: true, undef: true, browser: true */
/*eslint max-len: ["error", { "ignoreTemplateLiterals": true }]*/
(function ($) {
  "use strict";
  var $container;
  var $table = $("#cbr-table");
  var $date_rage_load = $("#date-rage-load");
  var $id_currency = $("#id_currency");
  var $id_date_status = $("#id_date_status");

  var table;
  var myModal;
  var self;
  $.widget("nmk.mainWidget", {
    options: {},
    _create: function () {
      $container = $(this.element);
      if (!$container.length) return;
      self = this;
      this.createEvent();
    },
    createEvent: function () {
      myModal = new bootstrap.Modal(document.getElementById("modal-msg"), {});

      table = $table.DataTable({
        searching: false,
        pageLength: "10",
        language: $.fn.languageDT(),
        columns: [
          {
            data: "gid",
            title: "#",
            width: "50px",
            searchable: false,
          },
          {
            data: "currency",
            title: "Валюта",
          },
          {
            data: "value",
            title: "Курс",
          },
          {
            data: "date_status",
            title: "Дата",
          },
        ],
        processing: true,
        serverSide: true,
        ajax: {
          url: "/api/exc-rates/",
          dataType: "json",
          type: "get",
          data: {
            format: "datatables",
            csrfmiddlewaretoken: $.cookie("csrftoken"),
          },
        },
      });

      $container.find("input[data-type='date']").datepicker({
        autoclose: true,
        format: "dd.mm.yyyy",
        todayBtn: "linked",
        clearBtn: true,
        language: "ru",
        endDate: "0d",
      });
      $date_rage_load.daterangepicker({
        locale: {
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
        },
      });

      $container.on("click", "#action-load", function () {
        self.load_curs();
      });
      $id_currency.on("change", function () {
        self.filter_dt(1, $(this).val());
      });
      $id_date_status.on("change", function () {
        self.filter_dt(3, $(this).val());
      });
    },
    filter_dt: function (col, val) {
      var regexr = "({search})";
      table
        .column(col)
        .search(
          this.value != ""
            ? regexr.replace("{search}", "(((" + val + ")))")
            : "",
          this.value != "",
          this.value == "",
        )
        .draw();
    },
    show_modal: function (text = `Ошибка, обратитесь к администратору`) {
      $("#modal-msg").find(".modal-body p").text(text);
      myModal.show();
    },
    load_curs: function () {
      let drage1 = $date_rage_load
        .data("daterangepicker")
        .startDate.format("YYYY-MM-DD");
      let drage2 = $date_rage_load
        .data("daterangepicker")
        .endDate.format("YYYY-MM-DD");
      $.ajax({
        url: "/api/create-tasc/",
        method: "POST",
        data: {
          csrfmiddlewaretoken: $.cookie("csrftoken"),
          date_start: drage1,
          date_end: drage2,
        },
        success: function (data) {
          if (data.status) {
            self.show_modal(
              "Задача по загрузке данных запущена. Через некоторое время данные появтся.",
            );
          } else {
            self.show_modal(data.msg);
          }
        },
        error: function () {
          self.show_modal();
        },
        complete: function () {},
      });
    },
  });
})(jQuery);
