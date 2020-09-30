Object.defineProperty(exports, "__esModule", {
  value: true,
});
let ejs = require("../../../../../../../node_modules/ejs/ejs");

exports.default = function (ctx) {
  let str = `<table class="<%= ctx.tableClass %>">
                    <tbody>
                    <% for (let i = 0; i < ctx.component.numRows; i++) { %>
                    <tr>
                        <% for (let j = 0; j < ctx.component.numCols; j++) { %>
                        <td><%- ctx.renderCell(i, j) %></td>
                        <% } %>
                    </tr>
                    <% } %>
                    </tbody>
                </table>`;

  let html = ejs.render(str, { ctx: ctx });
  return html;
};
