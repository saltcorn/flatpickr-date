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
      "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.6/flatpickr.min.js",
    integrity:
      "sha512-Nc36QpQAS2BOjt0g/CqfIi54O6+UWTI3fmqJsnXoU6rNYRq8vIQQkZmkrRnnk4xKgMC3ESWp69ilLpDm6Zu8wQ==",
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
  ],
  run: (nm, v, attrs, cls) => {
    const rndid = Math.floor(Math.random() * 16777215).toString(16);
    const opts = {
      enableTime: !attrs.day_only,
      allowInput: attrs.allow_input,
      dateFormat: attrs.day_only ? "Y-m-d" : "Z",
      altInput: !attrs.day_only,
      altFormat: "Y-m-d h:i K",
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
