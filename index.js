const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");
const range_filter = require("./date-range-filter");
const headers = [
  {
    script:
      "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js"
  },
  {
    script:'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/es.min.js'
  },
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/pt.min.js'
  },
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/fr.min.js'
  },
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/it.min.js'
  },
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/de.min.js'
  },
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/ru.min.js'
  },  
  {
    css:
      "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.6/flatpickr.min.css",
    integrity:
      "sha512-OtwMKauYE8gmoXusoKzA/wzQoh7WThXJcJVkA29fHP58hBF7osfY0WLCIZbwkeL9OgRCxtAfy17Pn3mndQ4PZQ==",
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
      label: "Min date (Ex: 2022-10-1 or today)",
      type: "String" 
    },
    // { Lo dejo comentado para mejoras a futuro
    //   name: "maxDate",
    //   label: "Max date (Ex: 2022-10-1 or today)",
    //   type: "String"
    // },
    {
      name: "locale",
      label: "Language (locale) availables: es, pt, fr, it, ru, de",
      type: "String"
    },
    {
      name: "dateFormat",
      label: "Date format",
      required: true,
      type: "String",
      attributes: { options: ["d-m-Y", "Y-m-d"] }
    }
  ],
  run: (nm, v, attrs, cls) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {
      enableTime: !attrs.day_only,
      allowInput: attrs.allow_input,
      dateFormat: attrs.day_only ? attrs.dateFormat : "Z",
      altInput: !attrs.day_only,
      altFormat: attrs.dateFormat+" h:i K",
      minDate: attrs.minDate,
      //maxDate: attrs.maxDate,
      locale: attrs.locale
    };
    return (
      input({
        type: "text",
        class: ["form-control", cls],
        name: text_attr(nm),
        disabled: attrs.disabled,
        id: `input${text_attr(nm)}${rndid}`,
        ...(typeof v !== "undefined" &&
          v !== null && {
            value: text_attr(
              typeof v === "string" ? v : v ? v.toISOString() : undefined
            ),
          }),
      }) +
      script(
        domReady(
          `$('#input${text(nm)}${rndid}').flatpickr(${JSON.stringify(opts)});`
        )
      )
    );
  },
};

module.exports = {
  sc_plugin_api_version: 1,
  fieldviews: { flatpickr },
  headers,
  viewtemplates: [range_filter],
};
