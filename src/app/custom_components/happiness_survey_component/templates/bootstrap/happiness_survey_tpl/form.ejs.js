Object.defineProperty(exports, "__esModule", {
  value: true,
});

let ejs = require("../../../../../../../node_modules/ejs/ejs");
const { v4: uuidv4 } = require("uuid");
const { environment } = require("../../../../../../environments/environment");

exports.default = function (ctx) {
  let componentId = uuidv4();

  let styleString = `<style>
                        .happiness-wrapper-${componentId} > label{
                          margin-right: 7%;
                        }

                        .happiness-input-${componentId} {
                          position: fixed;
                          left: 0;
                          top: -50px;
                        }

                        .happiness-emoji-${componentId},
                        .happiness-wrapper-${componentId} .happiness-emoji-${componentId} {
                          float: left;
                          display: block;
                          width: 16px;
                          height: 16px;
                        }
                        
                        .happiness-emoji-0-0-${componentId} {
                          background: url("${environment.appBaseUrl}/assets/images/smiley-emojis/happiest.png");
                          border-radius: 37px;
                          background-color: #cecece;
                          background-position: 0px 0px;
                        }
                        
                        .happiness-emoji-0-1-${componentId} {
                          background: url("${environment.appBaseUrl}/assets/images/smiley-emojis/happy.png");
                          border-radius: 37px;
                          background-color: #cecece;
                          background-position: 0px 0px;
                        }
                        
                        .happiness-emoji-0-2-${componentId} {
                          background: url("${environment.appBaseUrl}/assets/images/smiley-emojis/neutral.png");
                          border-radius: 37px;
                          background-color: #cecece;
                          background-position: 0px 0px;
                        }
                        
                        .happiness-emoji-0-3-${componentId} {
                          background: url("${environment.appBaseUrl}/assets/images/smiley-emojis/sad.png");
                          border-radius: 37px;
                          background-color: #cecece;
                          background-position: 0px 0px;
                        }

                        .happiness-wrapper-${componentId}:hover > label
                        {
                          background-color: #cecece !important;
                          background-position: 0px 0px !important;
                        }

                        .happiness-wrapper-${componentId} > input + label:hover {
                          background-color: white !important;
                          background-position: -75px 0px !important;
                        }
                        
                        .happiness-wrapper-${componentId} > input:checked + label {
                          background-color: white;
                          background-position: -75px 0px;
                        }
                        
                        .happiness-emoji-common-${componentId} {
                          height: 73px !important;
                          width: 73px !important;
                          background-repeat: no-repeat;
                          background-size: cover;
                          position: relative;
                        } 
                    </style>`;

  let str = `<div class="row" id="happiness-index-wrapper-id-${componentId}">
                <div class="col-md-12" style="margin-top:12px;">
                  <span> ${styleString}</span>
                  <%- ctxVal.setComponentUniqueId('${componentId}') %>
                    <div class="happiness-wrapper-${componentId}" id="happiness-wrapper-id-${componentId}">
                        <% for (let i = 0; i < ctxVal.component.numRows; i++) { %>
                                <% for (let j = 0; j < ctxVal.component.numCols; j++) { %>
                                  <%- ctxVal.renderCell(i, j,'${componentId}') %>
                                  <%- ctxVal.renderCellLabel(i, j,'${componentId}') %>
                                <% } %>
                        <% } %>
                    </div>
                  </div>
                </div>`;

  let html = ejs.render(str, { ctxVal: ctx });
  return html;
};
