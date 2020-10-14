const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");

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
  run: (nm, v, attrs, cls) =>
    input({
      type: "text",
      class: ["form-control", cls],
      name: text_attr(nm),
      disabled: attrs.disabled,
      id: `input${text_attr(nm)}`,
      ...(typeof v !== "undefined" && {
        value: text_attr(
          typeof v === "string" ? v : v ? v.toISOString() : undefined
        ),
      }),
    }) +
    script(
      domReady(
        `$('#input${text(
          nm
        )}').flatpickr({enableTime: true,dateFormat: "Y-m-d H:i"});`
      )
    ),
};

module.exports = {
  sc_plugin_api_version: 1,
  fieldviews: { flatpickr },
  headers,
};
