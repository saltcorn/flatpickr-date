const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");
const range_filter = require("./date-range-filter");
const base_headers = `/plugins/public/flatpickr-date@${
  require("./package.json").version
}`;
const { getState } = require("@saltcorn/data/db/state");

const headers = [
  {
    script: `${base_headers}/flatpickr.min.js`,
  },
  {
    script: `${base_headers}/l10n/es.min.js`,
  },
  {
    script: `${base_headers}/l10n/pt.min.js`,
  },
  {
    script: `${base_headers}/l10n/fr.min.js`,
  },
  {
    script: `${base_headers}/l10n/it.min.js`,
  },
  {
    script: `${base_headers}/l10n/de.min.js`,
  },
  {
    script: `${base_headers}/l10n/ru.min.js`,
  },
  {
    css: `${base_headers}/flatpickr.min.css`,
  },
  {
    cssDark: `${base_headers}/flatpickr-dark.css`,
  },
];

const flatpickr = {
  type: "Date",
  isEdit: true,
  configFields: [
    {
      name: "allow_input",
      label: "Allow input",
      type: "Bool",
    },
    {
      name: "day_only",
      label: "Only day",
      type: "Bool",
      //sublabel: "Do not pick time",
    },
    {
      name: "minDate",
      label: "Min date",
      type: "String",
      sublabel: "(Ex: 2022-10-1 or today)",
    },
    // { Lo dejo comentado para mejoras a futuro
    //   name: "maxDate",
    //   label: "Max date (Ex: 2022-10-1 or today)",
    //   type: "String"
    // },
    {
      name: "default_now",
      label: "Default to now",
      type: "Bool",
    },
    {
      name: "current_hm",
      label: "Current hour minute",
      sublabel: "Set default time of day to current time.",
      type: "Bool",
    },
    {
      name: "locale",
      label: "Language (locale)",
      sublabel: "Available: es, pt, fr, it, ru, de",
      type: "String",
    },

    {
      name: "dateFormat",
      label: "Date format",
      required: true,
      type: "String",
      default: "Y-m-d H:i",
      sublabel: `<a href="https://flatpickr.js.org/formatting/">Formatting options</a>`,
    },
    {
      name: "placeholder",
      label: "Placeholder",
      type: "String",
    },
  ],
  run: (nm, v, attrs, cls) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {
      enableTime: !attrs.day_only,
      allowInput: attrs.allow_input,
      dateFormat: attrs.day_only ? "Y-m-d" : "Z",
      altInput: true,
      altFormat: attrs.dateFormat || (attrs.day_only ? "Y-m-d" : "Y-m-d H:i"),
      minDate: attrs.minDate,
      //maxDate: attrs.maxDate,
      locale: attrs.locale || getState().getConfig("default_locale", "en"),
      defaultDate: attrs.default_now && !v ? new Date() : undefined,
      defaultHour: attrs.current_hm && !v ? new Date().getHours() : undefined,
      defaultMinute:
        attrs.current_hm && !v ? new Date().getMinutes() : undefined,
    };
    const prDate = (d) =>
      attrs.day_only
        ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getUTCDate()}`
        : d.toISOString();
    return (
      input({
        type: "text",
        class: ["form-control", cls],
        name: text_attr(nm),
        placeholder: attrs.placeholder,
        disabled: attrs.disabled,
        onchange: attrs.onChange,
        id: `input${text_attr(nm)}${rndid}`,
        ...(typeof v !== "undefined" &&
          v !== null && {
            value: text_attr(
              typeof v === "string"
                ? attrs.day_only
                  ? prDate(new Date(v))
                  : v
                : v
                ? prDate(typeof v === "number" ? new Date(v) : v)
                : undefined
            ),
          }),
      }) +
      script(
        domReady(
          //https://github.com/flatpickr/flatpickr/issues/2246#issuecomment-1251078615
          `const fp = $('#input${text(nm)}${rndid}').flatpickr(${JSON.stringify(
            opts
          )});$('#input${text(
            nm
          )}${rndid}').on("set_form_field", ()=>fp.setDate($('#input${text(
            nm
          )}${rndid}').val()));
          if (fp.mobileInput) {
            fp.mobileInput.setAttribute("step", "any")
          }`
        )
      )
    );
  },
};

module.exports = {
  sc_plugin_api_version: 1,
  fieldviews: {
    flatpickr,
    flatpickr_date_range: require("./date-range-fieldview.js"),
  },
  plugin_name: "flatpickr-date",
  headers,
  viewtemplates: [range_filter],
  ready_for_mobile: true,
};
