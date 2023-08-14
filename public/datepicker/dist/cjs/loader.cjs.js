'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-91b9f5da.js');

/*
 Stencil Client Patch Esm v2.18.1 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return index.promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return index.bootstrapLazy([["wc-datepicker.cjs",[[2,"wc-datepicker",{"clearButtonContent":[1,"clear-button-content"],"disabled":[4],"disableDate":[16],"elementClassName":[1,"element-class-name"],"firstDayOfWeek":[2,"first-day-of-week"],"range":[4],"labels":[16],"locale":[1],"nextMonthButtonContent":[1,"next-month-button-content"],"nextYearButtonContent":[1,"next-year-button-content"],"previousMonthButtonContent":[1,"previous-month-button-content"],"previousYearButtonContent":[1,"previous-year-button-content"],"showClearButton":[4,"show-clear-button"],"showMonthStepper":[4,"show-month-stepper"],"showTodayButton":[4,"show-today-button"],"showYearStepper":[4,"show-year-stepper"],"startDate":[1,"start-date"],"todayButtonContent":[1,"today-button-content"],"value":[1040],"currentDate":[32],"hoveredDate":[32],"weekdays":[32]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
