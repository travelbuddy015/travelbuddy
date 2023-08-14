import { r as registerInstance, c as createEvent, h, H as Host, g as getElement } from './index-2c898150.js';

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
function getDaysOfMonth(date, padded, firstDayOfWeek) {
  const days = [];
  const firstOfMonth = getFirstOfMonth(date);
  const firstDayMonth = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
  const lastOfMonth = getLastOfMonth(date);
  const lastDayOfMonth = lastOfMonth.getDay() === 0 ? 7 : lastOfMonth.getDay();
  const lastDayOfWeek = firstDayOfWeek === 1 ? 7 : firstDayOfWeek - 1;
  const leftPaddingDays = [];
  const rightPaddingDays = [];
  if (padded) {
    const leftPadding = (7 - firstDayOfWeek + firstDayMonth) % 7;
    let leftPaddingAmount = leftPadding;
    let leftPaddingDay = getPreviousDay(firstOfMonth);
    while (leftPaddingAmount > 0) {
      leftPaddingDays.push(leftPaddingDay);
      leftPaddingDay = getPreviousDay(leftPaddingDay);
      leftPaddingAmount -= 1;
    }
    leftPaddingDays.reverse();
    const rightPadding = (7 - lastDayOfMonth + lastDayOfWeek) % 7;
    let rightPaddingAmount = rightPadding;
    let rightPaddingDay = getNextDay(lastOfMonth);
    while (rightPaddingAmount > 0) {
      rightPaddingDays.push(rightPaddingDay);
      rightPaddingDay = getNextDay(rightPaddingDay);
      rightPaddingAmount -= 1;
    }
  }
  let currentDay = firstOfMonth;
  while (currentDay.getMonth() === date.getMonth()) {
    days.push(currentDay);
    currentDay = getNextDay(currentDay);
  }
  return [...leftPaddingDays, ...days, ...rightPaddingDays];
}
function getFirstOfMonth(date) {
  const firstOfMonth = removeTimezoneOffset(new Date(`${String(getYear(date)).padStart(4, '0')}-${String(getMonth(date)).padStart(2, '0')}-01`));
  return firstOfMonth;
}
function getISODateString(date) {
  if (!(date instanceof Date)) {
    return;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function getLastOfMonth(date) {
  const newDate = getFirstOfMonth(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return newDate;
}
function getMonth(date) {
  return date.getMonth() + 1;
}
function getMonths(locale) {
  return new Array(12).fill(undefined).map((_, month) => {
    const date = removeTimezoneOffset(new Date(`2006-${String(month + 1).padStart(2, '0')}-01`));
    return Intl.DateTimeFormat(locale, {
      month: 'long'
    }).format(date);
  });
}
function getNextDay(date) {
  return addDays(date, 1);
}
function getNextMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}
function getNextYear(date) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
}
function getPreviousDay(date) {
  return subDays(date, 1);
}
function getPreviousMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  return newDate;
}
function getPreviousYear(date) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - 1);
  return newDate;
}
function getWeekDays(firstDayOfWeek, locale) {
  return new Array(7)
    .fill(undefined)
    .map((_, index) => ((firstDayOfWeek + index) % 7) + 1)
    .map((day) => {
    const date = removeTimezoneOffset(new Date(`2006-01-0${day}`));
    return [
      Intl.DateTimeFormat(locale, {
        weekday: 'short'
      }).format(date),
      Intl.DateTimeFormat(locale, {
        weekday: 'long'
      }).format(date)
    ];
  });
}
function getYear(date) {
  return date.getFullYear();
}
function isDateInRange(date, range) {
  if (!date || !range || !range.from || !range.to) {
    return false;
  }
  const earlyDate = range.from < range.to ? range.from : range.to;
  const laterDate = range.from < range.to ? range.to : range.from;
  return date >= earlyDate && date <= laterDate;
}
function isSameDay(date1, date2) {
  if (!date1 || !date2) {
    return false;
  }
  return (date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate());
}
function removeTimezoneOffset(date) {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  return newDate;
}
function subDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

const wcDatepickerCss = ".visually-hidden.sc-wc-datepicker{position:absolute;overflow:hidden;width:1px;height:1px;white-space:nowrap;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%)}";

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
const WCDatepicker = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.selectDate = createEvent(this, "selectDate", 7);
    this.changeMonth = createEvent(this, "changeMonth", 7);
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
  get el() { return getElement(this); }
  static get watchers() { return {
    "firstDayOfWeek": ["watchFirstDayOfWeek"],
    "locale": ["watchLocale"],
    "range": ["watchRange"],
    "startDate": ["watchStartDate"],
    "value": ["watchValue"]
  }; }
};
WCDatepicker.style = wcDatepickerCss;

export { WCDatepicker as wc_datepicker };
