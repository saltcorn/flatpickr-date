const User = require("@saltcorn/data/models/user");
const Table = require("@saltcorn/data/models/table");
const Form = require("@saltcorn/data/models/form");
const Workflow = require("@saltcorn/data/models/workflow");
const {
  input,
  div,
  text,
  script,
  domReady,
  text_attr,
} = require("@saltcorn/markup/tags");
const configuration_workflow = () =>
  new Workflow({
    steps: [
      {
        name: "Layout",
        form: async (context) => {
          const table = await Table.findOne({ id: context.table_id });
          const fields = await table.getFields();
          const date_fields = fields
            .filter((f) => f.type.name === "Date")
            .map((f) => f.name);
          return new Form({
            fields: [
              {
                name: "date_field",
                label: "Date field",
                type: "String",
                required: true,
                attributes: {
                  options: date_fields.join(),
                },
              },
              {
                name: "end_date_field",
                label: "End date field",
                type: "String",
                sublabel:
                  "Optional. If selecting rows with the beginning and an end, use this for the end field",
                attributes: {
                  options: date_fields.join(),
                },
              },
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
          });
        },
      },
    ],
  });
const run = async (
  table_id,
  viewname,
  { date_field, end_date_field, placeholder, future_only },
  state,
  extra
) => {
  const table = Table.findOne({ id: table_id });
  const fields = table.getFields();
  const field = fields.find((f) => f.name === date_field);
  const name = text_attr(field.name);
  const set_initial =
    state[`_fromdate_${end_date_field || name}`] && state[`_todate_${name}`]
      ? `defaultDate: ["${state[`_fromdate_${end_date_field || name}`]}", "${
          state[`_todate_${name}`]
        }"],`
      : "";
  return (
    input({
      type: "text",
      class: "form-control",
      name: `daterangefilter${name}`,
      id: `daterangefilter${name}`,
      placeholder,
    }) +
    script(
      domReady(
        `$('#daterangefilter${name}').flatpickr({mode:'range',
        dateFormat: "Y-m-d",${set_initial}
        minDate: "today",
        onChange: function(selectedDates, dateStr, instance) {
            if(selectedDates.length==2) {
              ${
                end_date_field
                  ? `set_state_fields({_fromdate_${end_date_field}: selectedDates[0].toLocaleDateString('en-CA'), _todate_${name}: selectedDates[1].toLocaleDateString('en-CA') })`
                  : `set_state_fields({_fromdate_${name}: selectedDates[0].toLocaleDateString('en-CA'), _todate_${name}: selectedDates[1].toLocaleDateString('en-CA') })`
              }
                
            }            
        },
    });`
      )
    )
  );
};
const get_state_fields = () => [];
module.exports = {
  name: "Date Range Filter",
  description:
    "Limit selected rows to those for which a date fields falls in a range selected by the user",
  configuration_workflow,
  run,
  get_state_fields,
  display_state_form: false,
};
