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
var moment = require("moment");
var Highcharts = require("highcharts");
import { saveAs } from "file-saver";
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
  var $date_date_chart = $("#date-rage-chart");
  var $currency_chart = $("#id_currency_chart");
  var $filt_cont = $(".filter-contaner");

  var table;
  var alertModal;
  var self;
  var chart;
  $.widget("nmk.mainWidget", {
    options: {},
    _create: function () {
      $container = $(this.element);
      if (!$container.length) return;
      self = this;
      this.createTable();
      this.createEvent();
      this.eventChart();
    },
    eventChart: function () {
      $date_date_chart.daterangepicker({
        locale: $.fn.languageDR(),
        startDate: moment().startOf("day").subtract(1, "month"),
        endDate: moment().startOf("day"),
      });
      Highcharts.setOptions({
        lang: $.fn.languageCH(),
      });
      $(".chart-filter").on("change", "select,input", function () {
        self.loadChartdata(function (data) {
          self.initChart(data.data, data.info);
        });
      });
      $("#action-json2").on("click", function () {
        if (!chart) return;
        self.loadChartdata(function (data) {
          self.save_json(data.data);
        });
      });
    },
    convertChartDate: function (data) {
      let res = [];
      $.each(data, function (k, val) {
        let cdate = moment(val.date, "YYYY-MM-DD")
          .utcOffset(0, true)
          .startOf("day")
          .valueOf();
        res.push([cdate, val.value]);
      });
      return res;
    },
    loadChartdata: function (callb) {
      let drage1 = $date_date_chart
        .data("daterangepicker")
        .startDate.format("YYYY-MM-DD");
      let drage2 = $date_date_chart
        .data("daterangepicker")
        .endDate.format("YYYY-MM-DD");
      let pk = $currency_chart.val();
      if (!pk) return;
      $.ajax({
        url: "/api/get-valute-curs/",
        method: "GET",
        data: {
          currency: pk,
          date_start: drage1,
          date_end: drage2,
        },
        success: function (data) {
          if (data.status) {
            callb(data);
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
    initChart: function (data_json, info) {
      let data = self.convertChartDate(data_json);
      chart = Highcharts.chart("container", {
        chart: {
          zoomType: "x",
        },
        title: {
          text: info.title,
          align: "left",
        },
        subtitle: {
          text:
            document.ontouchstart === undefined
              ? "Нажмите и перетащите область графика, чтобы увеличить масштаб."
              : "Нажмите на диаграмму, чтобы увеличить ее.",
          align: "left",
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          title: {
            text: "Курс",
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.color(Highcharts.getOptions().colors[0])
                    .setOpacity(0)
                    .get("rgba"),
                ],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        series: [
          {
            type: "area",
            name: info.name,
            data: data,
          },
        ],
      });
    },
    createTable: function () {
      table = $table.DataTable({
        dom: "lrtip",
        pageLength: "10",
        language: $.fn.languageDT(),
        order: [[2, "desc"]],
        columns: [
          {
            name: "currency",
            data: "currency",
            title: "Валюта",
            render: function (data, type, row, meta) {
              let code = `<a class="redir-chart" title="Перейти к графику" href="#">${data}</a>`;
              return type === "display" ? code : data;
            },
          },
          {
            name: "currency__pk",
            data: "currency__pk",
            visible: false,
          },
          {
            data: "value",
            title: "Курс",
            orderable: false,
          },
          {
            data: "date_status",
            name: "date_status",
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
      $table.on("click", ".redir-chart", function () {
        self.clickTableValute($(this));
      });
    },
    clickTableValute: function (el) {
      var someTabTriggerEl = document.querySelector("#pills-profile-tab");
      var tab = new bootstrap.Tab(someTabTriggerEl);
      var closestRow = el.closest("tr");
      var data = table.row(closestRow).data();
      if (!data) return;
      $currency_chart.val(null).trigger("change");
      $currency_chart.find("option").remove();
      if (
        !$currency_chart.find("option[value='" + data.currency__pk + "']")
          .length
      ) {
        $currency_chart.append(
          new Option(data.currency, data.currency__pk, true, true),
        );
      }
      $currency_chart.trigger("change");

      let dt_sta = moment(data.date_status, "DD.MM.YYYY")
        .startOf("day")
        .subtract(1, "month");
      let dt_ste = moment(data.date_status, "DD.MM.YYYY").startOf("day");
      if (dt_sta && dt_ste) {
        $date_date_chart.data("daterangepicker").setStartDate(dt_sta);
        $date_date_chart.data("daterangepicker").setEndDate(dt_ste);
      }
      tab.show();
    },
    createEvent: function () {
      alertModal = new bootstrap.Modal(
        document.getElementById("modal-msg"),
        {},
      );
      $container.find("input[data-type='date']").datepicker({
        autoclose: true,
        format: "dd.mm.yyyy",
        todayBtn: "linked",
        clearBtn: true,
        language: "ru",
        endDate: "0d",
      });
      $date_rage_load.daterangepicker({
        startDate: moment().startOf("day").subtract(1, "month"),
        endDate: moment().startOf("day"),
        locale: $.fn.languageDR(),
      });

      $container.on("click", "#action-load", self.load_curs);
      $filt_cont.on("change", "select,input", function () {
        if ($filt_cont.hasClass("dis-action")) return;
        self.filter_dt();
      });

      $("#action-reset").on("click", function () {
        $filt_cont
          .addClass("dis-action")
          .find("select,input")
          .val(null)
          .trigger("change")
          .removeClass("dis-action");
        self.filter_dt();
      });
      $("#action-json").on("click", function () {
        self.export_dt();
      });
      $("#action-ref").on("click", function () {
        table.ajax.reload();
      });
    },
    export_dt: function () {
      var param = $.extend({}, table.ajax.params(), {
        length: -1,
        format: "datatables",
      });
      $.ajax({
        url: table.ajax.url(),
        method: "GET",
        data: param,
        success: function (data) {
          if (!data || !data.data || !data.data.length) {
            self.show_modal("Нет данных для скачивания.");
            return;
          }
          self.save_json(data.data);
        },
        error: function () {
          self.show_modal();
        },
        complete: function () {},
      });
    },
    save_json: function (data) {
      let blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "export.json");
    },
    filter_dt: function () {
      table.search("");
      $filt_cont.find("select,input").each(function () {
        let $elem = $(this);
        let col = `${$elem.attr("name")}:name`;
        if (!table.column(col).length) return;
        let val = self.cinvert_val($elem);

        table.column(col).search(val);
      });
      table.draw();
    },
    cinvert_val: function ($elem) {
      if ($elem.attr("data-type") == "date") {
        if (!$elem.val()) return "";
        return moment($elem.val(), "DD.MM.YYYY").format("YYYY-MM-DD");
      }
      return $elem.val();
    },
    show_modal: function (text = `Ошибка, обратитесь к администратору`) {
      $("#modal-msg").find(".modal-body p").text(text);
      alertModal.show();
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
              "Задача по загрузке данных запущена. Через некоторое время данные появятся.",
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
