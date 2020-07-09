import emiter from "../../utils/emiter";

// 元素设计时处理程序
export default function() {
  return function(field, options) {
    if (options.mode !== "design" || field.layout === true) {
      return;
    }

    const cloned = {
      ...field,
      layout: true,
      component: field.component || field.$conditionComponent
    };
    const { uuid, component, remark } = cloned;

    Object.keys(field).forEach(key => {
      delete field[key];
    });

    field.component = "div";
    field.layout = true;
    field.fieldOptions = {
      class: "design-element " + (emiter.editing === uuid ? "editing" : ""),
      on: {
        click: evt => {
          emiter.$emit("component-selected", cloned);
          emiter.setEditing(uuid);
          evt.stopPropagation();
        }
      }
    };
    field.children = [
      cloned,
      ...["top", "left", "bottom", "right"].map(item => ({
        component: "div",
        layout: true,
        fieldOptions: { class: "border border-" + item }
      })),
      {
        component: "span",
        layout: true,
        fieldOptions: {
          class: "tag",
          domProps: {
            innerText: remark ? component + "." + remark : component
          }
        }
      },
      {
        component: emiter.editing === uuid ? "a" : null,
        layout: true,
        fieldOptions: {
          class: "del",
          domProps: {
            innerHTML: '<i class="el-icon-delete"></i> 删除',
            href: "javascript:;"
          },
          on: {
            click: () => {
              this.$confirm("是否删除？")
                .then(() => {
                  emiter.$emit("component-delete", cloned);
                })
                .catch(() => {});
            }
          }
        }
      }
    ];
  };
}