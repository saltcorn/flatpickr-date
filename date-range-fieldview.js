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
  ],
  run: (nm, v, attrs = {}, cls, required, field, state = {}) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: attrs?.future_only ? "today" : undefined,
      //maxDate: attrs.maxDate,
      locale: attrs.locale,
      defaultDate: state[nm] || undefined,
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
          `$('#input${text(nm)}${rndid}').flatpickr(${JSON.stringify(opts)});`
        )
      )
    );
  },
};

module.exports = flatpickr_date_range;
