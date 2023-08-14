import { p as promiseResolve, b as bootstrapLazy } from './index-2c898150.js';

/*
 Stencil Client Patch Browser v2.18.1 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["wc-datepicker",[[2,"wc-datepicker",{"clearButtonContent":[1,"clear-button-content"],"disabled":[4],"disableDate":[16],"elementClassName":[1,"element-class-name"],"firstDayOfWeek":[2,"first-day-of-week"],"range":[4],"labels":[16],"locale":[1],"nextMonthButtonContent":[1,"next-month-button-content"],"nextYearButtonContent":[1,"next-year-button-content"],"previousMonthButtonContent":[1,"previous-month-button-content"],"previousYearButtonContent":[1,"previous-year-button-content"],"showClearButton":[4,"show-clear-button"],"showMonthStepper":[4,"show-month-stepper"],"showTodayButton":[4,"show-today-button"],"showYearStepper":[4,"show-year-stepper"],"startDate":[1,"start-date"],"todayButtonContent":[1,"today-button-content"],"value":[1040],"currentDate":[32],"hoveredDate":[32],"weekdays":[32]}]]]], options);
});
