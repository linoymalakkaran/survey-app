Object.defineProperty(exports, "__esModule", {
  value: true,
});
let ejs = require("../../../../../../../node_modules/ejs/ejs");
const { v4: uuidv4 } = require("uuid");
const { environment } = require("../../../../../../environments/environment");

exports.default = function (ctx) {
  let componentId = uuidv4();
  let labelBeforeContent = '\\f005';
  let labelBeforeHalfContent = '\\f089';

  let styleString = `<style>
              .rating-${componentId} > fieldset,
              .rating-${componentId} > label {
                margin: 0;
                padding: 0;
              }
              
              /****** Style Star Rating Widget *****/
              .rating-${componentId} {
                border: none;
                float: left;
              }
              
              .rating-${componentId} > input {
                display: none;
              }
              
              .rating-${componentId} > label:before {
                margin: 17px;
                font-size: 3.25em;
                font-family: FontAwesome;
                display: inline-block;
                content: "${labelBeforeContent}";
              }
              
              .rating-${componentId} > .half-${componentId}:before {
                content: "${labelBeforeHalfContent}";
                position: absolute;
              }
              
              .rating-${componentId} > label {
                color: #ddd;
                float: right;
              }
              
              /***** CSS Magic to Highlight Stars on Hover *****/
              .rating-${componentId} > input:checked ~ label, /* show gold star when clicked */
              .rating-${componentId}:not(:checked) > label:hover, /* hover current star */
              .rating-${componentId}:not(:checked) > label:hover ~ label {
                color: #ffd700;
              } /* hover previous stars in list */
              
              .rating-${componentId} > input:checked + label:hover, /* hover current star when changing rating */
              .rating-${componentId} > input:checked ~ label:hover,
              .rating-${componentId} > label:hover ~ input:checked ~ label, /* lighten current selection */
              .rating-${componentId} > input:checked ~ label:hover ~ label {
                color: #ffed85;
              }
              </style>`;

  let str = `<div class="row" id="star-rating-wrapper-id-${componentId}">
              <div class="col-md-12" style="margin-top:12px;">
                <fieldset class="rating-${componentId}">
                  <%- ctxVal.setComponentUniqueId('${componentId}') %>
                  <% for (let i = 0; i < ctxVal.component.numRows; i++) { %>
                    <% for (let j = 0; j < ctxVal.component.numCols; j++) { %>
                      <%- ctxVal.renderCell(i, j,'${componentId}') %>
                      <%- ctxVal.renderCellLabel(i, j,'${componentId}') %>
                    <% } %>
                  <% } %>
                  <span>${styleString}</span>
                </fieldset>
              </div>
            </div>`;

  let html = ejs.render(str, { ctxVal: ctx });
  return html;
};
