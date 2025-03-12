const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");

const flatpickr_date_range = {
  type: "Date",
  isFilter: true,
  isEdit: false,
  configFields: [
    {
      name: "placeholder",
      label: "Placeholder",
      type: "String",
    },
    {
      name: "future_only",
      label: "Future dates only",
      type: "Bool",
    },
    {
      name: "dateFormat",
      label: "Date format",
      required: true,
      type: "String",
      default: "Y-m-d",
      sublabel: `<a href="https://flatpickr.js.org/formatting/">Formatting options</a>`,
    },
  ],
  run: (nm, v, attrs = {}, cls, required, field, state = {}) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {
      mode: "range",
      dateFormat: "Y-m-d",
      altInput: !!attrs.dateFormat,
      altFormat: attrs.dateFormat || undefined,
      minDate: attrs?.future_only ? "today" : undefined,
      //maxDate: attrs.maxDate,
      locale: attrs.locale,
      defaultDate: [state[`_fromdate_${nm}`], state[`_todate_${nm}`]],
    };
    return (
      input({
        type: "text",
        class: ["form-control", cls],
        placeholder: attrs.placeholder,
        disabled: attrs.disabled,
        id: `input${text_attr(nm)}${rndid}`,
      }) +
      script(
        domReady(
          `$('#input${text(nm)}${rndid}').flatpickr({
            ...${JSON.stringify(opts)},
            onChange: function(selectedDates, dateStr, instance) {
              if(selectedDates.length==2) 
                set_state_fields({_fromdate_${nm}: selectedDates[0].toLocaleDateString('en-CA'), _todate_${nm}: selectedDates[1].toLocaleDateString('en-CA') })                     
          },
        });`
        )
      )
    );
  },
};

module.exports = flatpickr_date_range;
