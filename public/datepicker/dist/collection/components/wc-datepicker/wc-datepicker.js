import { h, Host } from '@stencil/core';
import { addDays, getDaysOfMonth, getFirstOfMonth, getISODateString, getLastOfMonth, getMonth, getMonths, getNextDay, getNextMonth, getNextYear, getPreviousDay, getPreviousMonth, getPreviousYear, getWeekDays, getYear, isDateInRange, isSameDay, removeTimezoneOffset, subDays } from '../../utils/utils';
const defaultLabels = {
  clearButton: 'Clear value',
  monthSelect: 'Select month',
  nextMonthButton: 'Next month',
  nextYearButton: 'Next year',
  picker: 'Choose date',
  previousMonthButton: 'Previous month',
  previousYearButton: 'Previous year',
  todayButton: 'Show today',
  yearSelect: 'Select year'
};
export class WCDatepicker {
  constructor() {
    this.disabled = false;
    this.disableDate = () => false;
    this.elementClassName = 'wc-datepicker';
    this.firstDayOfWeek = 0;
    this.labels = defaultLabels;
    this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || 'en-US';
    this.showClearButton = false;
    this.showMonthStepper = true;
    this.showTodayButton = false;
    this.showYearStepper = false;
    this.startDate = getISODateString(new Date());
    this.init = () => {
      this.currentDate = this.startDate
        ? removeTimezoneOffset(new Date(this.startDate))
        : new Date();
      this.updateWeekdays();
    };
    this.nextMonth = () => {
      this.updateCurrentDate(getNextMonth(this.currentDate));
    };
    this.nextYear = () => {
      this.updateCurrentDate(getNextYear(this.currentDate));
    };
    this.previousMonth = () => {
      this.updateCurrentDate(getPreviousMonth(this.currentDate));
    };
    this.previousYear = () => {
      this.updateCurrentDate(getPreviousYear(this.currentDate));
    };
    this.showToday = () => {
      this.updateCurrentDate(new Date());
    };
    this.clear = () => {
      this.value = undefined;
      this.selectDate.emit(undefined);
    };
    this.onClick = (event) => {
      if (this.disabled) {
        return;
      }
      const target = event.target.closest('[data-date]');
      if (!Boolean(target)) {
        return;
      }
      const date = removeTimezoneOffset(new Date(target.dataset.date));
      this.updateCurrentDate(date);
      this.onSelectDate(date);
    };
    this.onMonthSelect = (event) => {
      const month = +event.target.value - 1;
      const date = new Date(this.currentDate);
      date.setMonth(month);
      this.updateCurrentDate(date);
    };
    this.onYearSelect = (event) => {
      let year = +event.target.value;
      const input = event.target;
      if (isNaN(year)) {
        year = new Date().getFullYear();
        input.value = String(year);
      }
      else if (year < 0) {
        year = 0;
        input.value = String(year);
      }
      else if (year > 9999) {
        year = 9999;
        input.value = String(year);
      }
      const date = new Date(this.currentDate);
      date.setFullYear(year);
      this.updateCurrentDate(date);
    };
    this.onKeyDown = (event) => {
      if (this.disabled) {
        return;
      }
      if (event.code === 'ArrowLeft') {
        event.preventDefault();
        this.updateCurrentDate(getPreviousDay(this.currentDate), true);
      }
      else if (event.code === 'ArrowRight') {
        event.preventDefault();
        this.updateCurrentDate(getNextDay(this.currentDate), true);
      }
      else if (event.code === 'ArrowUp') {
        event.preventDefault();
        this.updateCurrentDate(subDays(this.currentDate, 7), true);
      }
      else if (event.code === 'ArrowDown') {
        event.preventDefault();
        this.updateCurrentDate(addDays(this.currentDate, 7), true);
      }
      else if (event.code === 'PageUp') {
        event.preventDefault();
        if (event.shiftKey) {
          this.updateCurrentDate(getPreviousYear(this.currentDate), true);
        }
        else {
          this.updateCurrentDate(getPreviousMonth(this.currentDate), true);
        }
      }
      else if (event.code === 'PageDown') {
        event.preventDefault();
        if (event.shiftKey) {
          this.updateCurrentDate(getNextYear(this.currentDate), true);
        }
        else {
          this.updateCurrentDate(getNextMonth(this.currentDate), true);
        }
      }
      else if (event.code === 'Home') {
        event.preventDefault();
        this.updateCurrentDate(getFirstOfMonth(this.currentDate), true);
      }
      else if (event.code === 'End') {
        event.preventDefault();
        this.updateCurrentDate(getLastOfMonth(this.currentDate), true);
      }
      else if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        this.onSelectDate(this.currentDate);
      }
    };
    this.onMouseEnter = (event) => {
      if (this.disabled) {
        return;
      }
      const date = removeTimezoneOffset(new Date(event.target.closest('td').dataset.date));
      this.hoveredDate = date;
    };
    this.onMouseLeave = () => {
      this.hoveredDate = undefined;
    };
  }
  componentWillLoad() {
    this.init();
  }
  watchFirstDayOfWeek() {
    this.updateWeekdays();
  }
  watchLocale() {
    if (!Boolean(this.locale)) {
      this.locale = (navigator === null || navigator === void 0 ? void 0 : navigator.language) || 'en-US';
    }
    this.updateWeekdays();
  }
  watchRange() {
    this.value = undefined;
    this.selectDate.emit(undefined);
  }
  watchStartDate() {
    this.currentDate = this.startDate
      ? removeTimezoneOffset(new Date(this.startDate))
      : new Date();
  }
  watchValue() {
    if (Boolean(this.value)) {
      if (Array.isArray(this.value) && this.value.length >= 1) {
        this.currentDate = this.value[0];
      }
      else if (this.value instanceof Date) {
        this.currentDate = this.value;
      }
    }
  }
  componentDidRender() {
    if (this.moveFocusAfterMonthChanged) {
      this.focusDate(this.currentDate);
      this.moveFocusAfterMonthChanged = false;
    }
  }
  updateWeekdays() {
    this.weekdays = getWeekDays(this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek, this.locale);
  }
  getClassName(element) {
    return Boolean(element)
      ? `${this.elementClassName}__${element}`
      : this.elementClassName;
  }
  getCalendarRows() {
    const daysOfMonth = getDaysOfMonth(this.currentDate, true, this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek);
    const calendarRows = [];
    for (let i = 0; i < daysOfMonth.length; i += 7) {
      const row = daysOfMonth.slice(i, i + 7);
      calendarRows.push(row);
    }
    return calendarRows;
  }
  getTitle() {
    if (!Boolean(this.currentDate)) {
      return;
    }
    return Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(this.currentDate);
  }
  focusDate(date) {
    var _a;
    (_a = this.el
      .querySelector(`[data-date="${getISODateString(date)}"]`)) === null || _a === void 0 ? void 0 : _a.focus();
  }
  updateCurrentDate(date, moveFocus) {
    const month = date.getMonth();
    const year = date.getFullYear();
    if (year > 9999 || year < 0) {
      return;
    }
    const monthChanged = month !== this.currentDate.getMonth() ||
      year !== this.currentDate.getFullYear();
    if (monthChanged) {
      this.changeMonth.emit({ month: getMonth(date), year: getYear(date) });
      if (moveFocus) {
        this.moveFocusAfterMonthChanged = true;
      }
    }
    this.currentDate = date;
    if (moveFocus) {
      this.focusDate(this.currentDate);
    }
  }
  onSelectDate(date) {
    var _a, _b;
    if (this.disableDate(date)) {
      return;
    }
    if (this.isRangeValue(this.value)) {
      const newValue = ((_a = this.value) === null || _a === void 0 ? void 0 : _a[0]) === undefined || this.value.length === 2
        ? [date]
        : [this.value[0], date];
      if (newValue.length === 2 && newValue[0] > newValue[1]) {
        newValue.reverse();
      }
      const isoValue = newValue[1] === undefined
        ? [getISODateString(newValue[0])]
        : [getISODateString(newValue[0]), getISODateString(newValue[1])];
      this.value = newValue;
      this.selectDate.emit(isoValue);
    }
    else {
      if (((_b = this.value) === null || _b === void 0 ? void 0 : _b.getTime()) === date.getTime()) {
        return;
      }
      this.value = date;
      this.selectDate.emit(getISODateString(date));
    }
  }
  // @ts-ignore
  isRangeValue(value) {
    return this.range;
  }
  render() {
    const showFooter = this.showTodayButton || this.showClearButton;
    return (h(Host, null, h("div", { "aria-disabled": String(this.disabled), "aria-label": this.labels.picker, class: {
        [this.getClassName()]: true,
        [`${this.getClassName()}--disabled`]: this.disabled
      }, role: "group" }, h("div", { class: this.getClassName('header') }, h("span", { "aria-atomic": "true", "aria-live": "polite", class: "visually-hidden" }, this.getTitle()), this.showYearStepper && (h("button", { "aria-label": this.labels.previousYearButton, class: this.getClassName('previous-year-button'), disabled: this.disabled, innerHTML: this.previousYearButtonContent || undefined, onClick: this.previousYear, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "11 17 6 12 11 7" }), h("polyline", { points: "18 17 13 12 18 7" })))), this.showMonthStepper && (h("button", { "aria-label": this.labels.previousMonthButton, class: this.getClassName('previous-month-button'), disabled: this.disabled, innerHTML: this.previousMonthButtonContent || undefined, onClick: this.previousMonth, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "15 18 9 12 15 6" })))), h("span", { class: this.getClassName('current-month') }, h("select", { "aria-label": this.labels.monthSelect, class: this.getClassName('month-select'), disabled: this.disabled, name: "month", onChange: this.onMonthSelect }, getMonths(this.locale).map((month, index) => (h("option", { key: month, selected: this.currentDate.getMonth() === index, value: index + 1 }, month)))), h("input", { "aria-label": this.labels.yearSelect, class: this.getClassName('year-select'), disabled: this.disabled, max: 9999, maxLength: 4, min: 1, name: "year", onChange: this.onYearSelect, type: "number", value: this.currentDate.getFullYear() })), this.showMonthStepper && (h("button", { "aria-label": this.labels.nextMonthButton, class: this.getClassName('next-month-button'), disabled: this.disabled, innerHTML: this.nextMonthButtonContent || undefined, onClick: this.nextMonth, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "9 18 15 12 9 6" })))), this.showYearStepper && (h("button", { "aria-label": this.labels.nextYearButton, class: this.getClassName('next-year-button'), disabled: this.disabled, innerHTML: this.nextYearButtonContent || undefined, onClick: this.nextYear, type: "button" }, h("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h("polyline", { points: "13 17 18 12 13 7" }), h("polyline", { points: "6 17 11 12 6 7" }))))), h("div", { class: this.getClassName('body') }, h("table", { class: this.getClassName('calendar'), onKeyDown: this.onKeyDown, role: "grid" }, h("thead", { class: this.getClassName('calendar-header') }, h("tr", { class: this.getClassName('weekday-row') }, this.weekdays.map((weekday) => (h("th", { abbr: weekday[1], class: this.getClassName('weekday'), key: weekday[0], scope: "col" }, h("span", null, weekday[0])))))), h("tbody", null, this.getCalendarRows().map((calendarRow) => {
      const rowKey = `row-${calendarRow[0].getMonth()}-${calendarRow[0].getDate()}`;
      return (h("tr", { class: this.getClassName('calendar-row'), key: rowKey }, calendarRow.map((day) => {
        var _a, _b, _c, _d, _e;
        const isCurrent = isSameDay(day, this.currentDate);
        const isOverflowing = day.getMonth() !== this.currentDate.getMonth();
        const isSelected = Array.isArray(this.value)
          ? isSameDay(day, this.value[0]) ||
            isSameDay(day, this.value[1])
          : isSameDay(day, this.value);
        const isInRange = !this.isRangeValue
          ? false
          : isDateInRange(day, {
            from: (_a = this.value) === null || _a === void 0 ? void 0 : _a[0],
            to: ((_b = this.value) === null || _b === void 0 ? void 0 : _b[1]) ||
              this.hoveredDate ||
              this.currentDate
          });
        const orderedValues = Boolean((_c = this.value) === null || _c === void 0 ? void 0 : _c[0])
          ? [
            (_d = this.value) === null || _d === void 0 ? void 0 : _d[0],
            ((_e = this.value) === null || _e === void 0 ? void 0 : _e[1]) || this.hoveredDate
          ].sort((a, b) => a - b)
          : [];
        const isStart = this.range && isSameDay(orderedValues[0], day);
        const isEnd = this.range && isSameDay(orderedValues[1], day);
        const isToday = isSameDay(day, new Date());
        const isDisabled = this.disableDate(day);
        const cellKey = `cell-${day.getMonth()}-${day.getDate()}`;
        const className = {
          [this.getClassName('date')]: true,
          [this.getClassName('date--current')]: isCurrent,
          [this.getClassName('date--disabled')]: isDisabled,
          [this.getClassName('date--overflowing')]: isOverflowing,
          [this.getClassName('date--today')]: isToday,
          [this.getClassName('date--selected')]: isSelected,
          [this.getClassName('date--in-range')]: isInRange,
          [this.getClassName('date--start')]: isStart,
          [this.getClassName('date--end')]: isEnd
        };
        const Tag = isSelected
          ? 'strong'
          : isToday
            ? 'em'
            : 'span';
        return (h("td", { "aria-disabled": String(isDisabled), "aria-selected": isSelected ? 'true' : undefined, class: className, "data-date": getISODateString(day), key: cellKey, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, role: "gridcell", tabIndex: isSameDay(day, this.currentDate) && !this.disabled
            ? 0
            : -1 }, h(Tag, { "aria-hidden": "true" }, day.getDate()), h("span", { class: "visually-hidden" }, Intl.DateTimeFormat(this.locale, {
          day: 'numeric',
          month: 'long'
        }).format(day))));
      })));
    })))), showFooter && (h("div", { class: this.getClassName('footer') }, this.showTodayButton && (h("button", { class: this.getClassName('today-button'), disabled: this.disabled, innerHTML: this.todayButtonContent || undefined, onClick: this.showToday, type: "button" }, this.labels.todayButton)), this.showClearButton && (h("button", { class: this.getClassName('clear-button'), disabled: this.disabled, innerHTML: this.clearButtonContent || undefined, onClick: this.clear, type: "button" }, this.labels.clearButton)))))));
  }
  static get is() { return "wc-datepicker"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() {
    return {
      "$": ["wc-datepicker.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["wc-datepicker.css"]
    };
  }
  static get properties() {
    return {
      "clearButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "clear-button-content",
        "reflect": false
      },
      "disabled": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "disabled",
        "reflect": false,
        "defaultValue": "false"
      },
      "disableDate": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "(date: Date) => boolean",
          "resolved": "(date: Date) => boolean",
          "references": {
            "Date": {
              "location": "global"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "defaultValue": "() => false"
      },
      "elementClassName": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "element-class-name",
        "reflect": false,
        "defaultValue": "'wc-datepicker'"
      },
      "firstDayOfWeek": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "first-day-of-week",
        "reflect": false,
        "defaultValue": "0"
      },
      "range": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "range",
        "reflect": false
      },
      "labels": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "WCDatepickerLabels",
          "resolved": "{ clearButton: string; monthSelect: string; nextMonthButton: string; nextYearButton: string; picker: string; previousMonthButton: string; previousYearButton: string; todayButton: string; yearSelect: string; }",
          "references": {
            "WCDatepickerLabels": {
              "location": "local"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "defaultValue": "defaultLabels"
      },
      "locale": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "locale",
        "reflect": false,
        "defaultValue": "navigator?.language || 'en-US'"
      },
      "nextMonthButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "next-month-button-content",
        "reflect": false
      },
      "nextYearButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "next-year-button-content",
        "reflect": false
      },
      "previousMonthButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "previous-month-button-content",
        "reflect": false
      },
      "previousYearButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "previous-year-button-content",
        "reflect": false
      },
      "showClearButton": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "show-clear-button",
        "reflect": false,
        "defaultValue": "false"
      },
      "showMonthStepper": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "show-month-stepper",
        "reflect": false,
        "defaultValue": "true"
      },
      "showTodayButton": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "show-today-button",
        "reflect": false,
        "defaultValue": "false"
      },
      "showYearStepper": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "show-year-stepper",
        "reflect": false,
        "defaultValue": "false"
      },
      "startDate": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "start-date",
        "reflect": false,
        "defaultValue": "getISODateString(new Date())"
      },
      "todayButtonContent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "today-button-content",
        "reflect": false
      },
      "value": {
        "type": "unknown",
        "mutable": true,
        "complexType": {
          "original": "Date | Date[]",
          "resolved": "Date | Date[]",
          "references": {
            "Date": {
              "location": "global"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        }
      }
    };
  }
  static get states() {
    return {
      "currentDate": {},
      "hoveredDate": {},
      "weekdays": {}
    };
  }
  static get events() {
    return [{
        "method": "selectDate",
        "name": "selectDate",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "string | string[] | undefined",
          "resolved": "string | string[]",
          "references": {}
        }
      }, {
        "method": "changeMonth",
        "name": "changeMonth",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "MonthChangedEventDetails",
          "resolved": "MonthChangedEventDetails",
          "references": {
            "MonthChangedEventDetails": {
              "location": "local"
            }
          }
        }
      }];
  }
  static get elementRef() { return "el"; }
  static get watchers() {
    return [{
        "propName": "firstDayOfWeek",
        "methodName": "watchFirstDayOfWeek"
      }, {
        "propName": "locale",
        "methodName": "watchLocale"
      }, {
        "propName": "range",
        "methodName": "watchRange"
      }, {
        "propName": "startDate",
        "methodName": "watchStartDate"
      }, {
        "propName": "value",
        "methodName": "watchValue"
      }];
  }
}
