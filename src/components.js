import $ from 'jquery'
export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  editor.TraitManager.addType('en-input', {
    // Expects as return a simple HTML string or an HTML element
    createInput({
      trait
    }) {
      // Here we can decide to use properties from the trait
      // Create a new element container and add some content
      const el = document.createElement('div');
      var name = ''
      if (trait.id === 'tableSymbol') {
        name = 'table_' + (editor.DomComponents.getWrapper().view.$el.find('table').length - 1)
      }

      el.innerHTML = `<input  type="text"  value='${name}' maxlength="64" onkeyup="value=value.replace(/[^a-zA-Z]/g,'')"/>`;
      return el;
    },
  });
  editor.TraitManager.addType('my-button', {
    // Expects as return a simple HTML string or an HTML element
    createInput({
      trait
    }) {
      // Here we can decide to use properties from the trait
      // Create a new element container and add some content
      const el = document.createElement('div');
      el.innerHTML = `<input  type="button"  class="href-button__type" value='新增'/>`;
      const inputType = el.querySelector('.href-button__type');
      inputType.addEventListener('click', (ev) => {
        const component = editor.getSelected();
        component.addTrait({
          type: 'table-attr',
          name: "row" + (component.getChildAt(0).getChildAt(0).get('components').length + 1)
        }, {
          at: component.attributes.traits.length - 1
        });

        component.getChildAt(0).getChildAt(0).append("<p style='border: 1px dashed;height: 20px;'>text</p>")
        component.getChildAt(0).getChildAt(0).getLastChild().set({
          tagName: 'td',
          type: 'cell',
          attributes: {}
        })
        component.view.$el.children().find("tr")[1].innerHTML += '<td  style=" border: 1px dashed;height:20px"></td>'
      })
      return el;
    },
  });

  editor.TraitManager.addType('table-attr', {
    // Expects as return a simple HTML string or an HTML element
    createInput({
      trait
    }) {
      // Here we can decide to use properties from the trait
      const component = editor.getSelected();
      const el = document.createElement('div');

        el.innerHTML = `
        <input type='button' class='ToggleButton' value="展开/收起" style="border: 1px solid #179fed;
        background: #179fed;margin-bottom: 10px;"/>
        <div >
        <label for="name">显示名称</label><input  class='input-name' id="name"  type="text"/>
        <label>标识符</label><input class='input-symbol' value="table_${trait.id}" type="text"/>
        <label>类型</label><select  class='input-type' type="text" value="text">
        <option value="text">文本</option>
        <option value="number">数字</option>
        </select>
        <label>宽度(mm)</label><input   class='input-width' type="text"/>
      </div>`;

//       el.innerHTML = `<div class="layui-collapse" lay-filter="test">
//     <div class="layui-colla-item">
//       <h2 class="layui-colla-title">${trait.id}</h2>
//       <div class="layui-colla-content">
//       <div>
//   <label for="name">显示名称</label><input  class='input-name' id="name"  type="text"/>
//   <label>标识符</label><input class='input-symbol' value="table_${trait.id}" type="text"/>
//   <label>类型</label><select  class='input-type' type="text" value="text">
//   <option value="text">文本</option>
//   <option value="number">数字</option>
//   </select>
//   <label>宽度(mm)</label><input   class='input-width' type="text"/>
// </div>
//       </div>
//     </div>
// </div>`
      //
      const ToggleButton=el.querySelector('.ToggleButton');
      const inputName = el.querySelector('.input-name');
      const inputSymbol = el.querySelector('.input-symbol');
      const inputType = el.querySelector('.input-type');
      const inputWidth = el.querySelector('.input-width');
      // var tempCom = component.getChildAt(0).getChildAt(0).getChildAt(trait.id.split("row")[1] - 1)
      // tempCom.setAttributes({
      //   inputName:inputName?.value,
      //   inputSymbol:inputSymbol?.value,
      //   inputType:inputType?.value,
      //   inputWidth:inputWidth?.value
      // })
      ToggleButton.addEventListener('click',ev=>{

        $(ev.target).next().css('display',$(ev.target).next().css("display")==="none"?"block":"none")
      })
      inputName.addEventListener('change', ev => {
        var tempCom = component.getChildAt(0).getChildAt(0).getChildAt(trait.id.split("row")[1] - 1)
        component.view.$el.children().find("td")[trait.id.split("row")[1] - 1].innerHTML = ev.target.value
        tempCom.setAttributes({
          ...tempCom.getAttributes(),
          inputName: ev.target.value
        })
      })
      inputWidth.addEventListener('change', ev => {
        var tempCom = component.getChildAt(0).getChildAt(0).getChildAt(trait.id.split("row")[1] - 1)
        component.view.$el.children().find("td")[trait.id.split("row")[1] - 1].width = ev.target.value
      })
      inputSymbol.addEventListener('change', ev => {
        var tempCom = component.getChildAt(0).getChildAt(0).getChildAt(trait.id.split("row")[1] - 1)
        tempCom.setAttributes({
          ...tempCom.getAttributes(),
          inputSymbol: ev.target.value
        })
      })
      inputType.addEventListener('change', ev => {
        var tempCom = component.getChildAt(0).getChildAt(0).getChildAt(trait.id.split("row")[1] - 1)
        tempCom.setAttributes({
          ...tempCom.getAttributes(),
          inputType: ev.target.value
        })
      })


      return el;
    },
  });
  domc.addType('my-cutter', {
    model: {
      defaults: {
        // type: 'image',
        tagName: 'img',
        void: true,
        droppable: 0,
        editable: 1,
        highlightable: 0,
        resizable: {
          ratioDefault: 1
        },
        traits: [{
          type: 'select',
          name: "src",
          label: '切刀模式',
          options: [{
              id: 'https://s1.ax1x.com/2022/07/07/jwbDsK.png',
              name: '全切'
            },
            {
              id: 'https://s1.ax1x.com/2022/07/08/jBMmp4.png',
              name: '半切'
            },
          ]
        }, ],
        attributes: {
          src: "https://s1.ax1x.com/2022/07/07/jwbDsK.png",
          alt: "切刀",
          cutterType: "0"
          // style: `width:100%;height:22px`
        },
      },

    },
    view: {

    },
  });
  domc.addType('my-QRCode', {
    model: {
      defaults: {
        // type: 'image',
        tagName: 'img',
        void: true,
        droppable: 0,
        editable: 1,
        highlightable: 0,
        resizable: {
          ratioDefault: 1
        },
        traits: [{
            type: 'en-input',
            name: '字段标识',
            maxlength: 10,
          }, {
            type: 'select', // Type of the trait
            label: '条码类型', // The label you will see in Settings
            name: 'type', // The name of the attribute/property to use on component
            options: [{
                id: ' PDF417',
                name: ' PDF417'
              },
              {
                id: 'QR Code',
                name: 'QR Code'
              },
              {
                id: 'Code 49',
                name: 'Code 49'
              },
              {
                id: 'Code 16K',
                name: 'Code 16K'
              },
              {
                id: 'Code One',
                name: 'Code One'
              },
            ]
          },
          {
            type: 'text',
            label: '宽度(mm)',
            name: 'width',
          },
          {
            type: 'text',
            label: '高度(mm)',
            name: 'height',
          },

        ],
        attributes: {
          src: "https://s1.ax1x.com/2022/07/08/j0IIxK.png",
          alt: "二维码",
        },
      },

      init() {
        this.on('change:attributes:width', this.typeChange);
        this.on('change:attributes:height', this.typeChange);
      },
      typeChange() {
        const component = editor.getSelected();
        const sm = editor.StyleManager;
        const wrapper = editor.DomComponents.getWrapper();
        sm.addStyleTargets({
          'width': component.getTrait('width').props().value * 4 + "px"
        });
        sm.addStyleTargets({
          'height': component.getTrait('height').props().value * 4 + "px"
        });
      }
    },

    view: {

    },
  });
  domc.addType('my-barCode', {
    model: {
      defaults: {
        // type: 'image',
        tagName: 'img',
        void: true,
        droppable: 0,
        editable: 1,
        highlightable: 0,
        resizable: {
          ratioDefault: 1
        },
        traits: [{
            type: 'en-input',
            name: '字段标识',
          }, {
            type: 'select', // Type of the trait
            label: '条码类型', // The label you will see in Settings
            name: 'type', // The name of the attribute/property to use on component
            options: [{
                id: ' code32',
                name: ' code32'
              },
              {
                id: 'code128',
                name: 'code128'
              },
            ]
          },
          {
            type: 'text',
            label: '宽度(mm)',
            name: 'width',
          },
          {
            type: 'text',
            label: '高度(mm)',
            name: 'height',
          },

        ],
        attributes: {
          src: "https://s1.ax1x.com/2022/07/08/j0IqVH.png",
          alt: "条码",
          // style: `width:80px;height:80px`
        },
      },

      init() {
        this.on('change:attributes:width', this.typeChange);
        this.on('change:attributes:height', this.typeChange);
      },
      typeChange() {
        const component = editor.getSelected();
        const sm = editor.StyleManager;
        const wrapper = editor.DomComponents.getWrapper();
        sm.addStyleTargets({
          'width': component.getTrait('width').props().value * 4 + "px"
        });
        sm.addStyleTargets({
          'height': component.getTrait('height').props().value * 4 + "px"
        });
      }
    },
    view: {

    },
  });
  domc.addType('image', {
    model: {
      defaults: {
        type: 'image',
        tagName: 'img',
        void: true,
        droppable: 0,
        editable: 1,
        highlightable: 0,
        resizable: {
          ratioDefault: 1
        },
        traits: [{
            type: 'en-input',
            name: '字段标识',
          },
          {
            type: 'text',
            label: '宽度(mm)',
            name: 'width',
          },
          {
            type: 'text',
            label: '高度(mm)',
            name: 'height',
          },
        ],
        attributes: {
          //src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6IHJnYmEoMCwwLDAsMC4xNSk7IHRyYW5zZm9ybTogc2NhbGUoMC43NSkiPgogICAgICAgIDxwYXRoIGQ9Ik04LjUgMTMuNWwyLjUgMyAzLjUtNC41IDQuNSA2SDVtMTYgMVY1YTIgMiAwIDAgMC0yLTJINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMnoiPjwvcGF0aD4KICAgICAgPC9zdmc+",
          alt: "位图",
          //style: `width:80px;height:80px`
        },
      },
      init() {
        this.on('change:attributes:width', this.typeChange);
        this.on('change:attributes:height', this.typeChange);
      },
      typeChange() {
        const component = editor.getSelected();
        const sm = editor.StyleManager;
        const wrapper = editor.DomComponents.getWrapper();
        sm.addStyleTargets({
          'width': component.getTrait('width').props().value * 4 + "px"
        });
        sm.addStyleTargets({
          'height': component.getTrait('height').props().value * 4 + "px"
        });
      }
    },
    view: {

    },
  });

  // domc.addType('cell', {
  //   model: {
  //     defaults: {
  //       tagName: "td",
  //       traits: [{
  //           type: 'en-input',
  //           name: '字段标识',
  //         },
  //         {
  //           type: 'text',
  //           label: '宽度(mm)',
  //           name: 'width',
  //         },
  //         {
  //           type: 'text',
  //           label: '高度(mm)',
  //           name: 'height',
  //         },
  //       ],
  //       attributes: {

  //       },
  //     },
  //   },
  //   view: {

  //   },
  // });

  domc.addType('text', {
    model: {
      defaults: {
        traits: [{
            type: 'text',
            name: 'name',
            label: '组件名称'
          },
          {
            type: 'select',
            name: "editable",
            label: '文本格式',
            options: [{
                id: 'flex',
                name: '静态文本'
              },
              {
                id: 'dynamic',
                name: '动态文本'
              },
            ]
          },
          {
            type: 'text',
            name: '文本内容'
          },

          {
            type: 'select', // Type of the trait
            label: '字体大小', // The label you will see in Settings
            name: 'fontSize', // The name of the attribute/property to use on component
            options: [{
                id: '1',
                name: '1'
              },
              {
                id: '2',
                name: '2'
              },
              {
                id: '3',
                name: '3'
              },
              {
                id: '4',
                name: '4'
              },
              {
                id: '5',
                name: '5'
              },
              {
                id: '6',
                name: '6'
              },

            ]
          }, {
            type: 'checkbox',
            name: '加粗',
          }, {
            type: 'checkbox',
            name: '下划线',
          },
          {
            type: 'checkbox',
            name: '自动换行',
          }
        ],

        attributes: {
          type: '0',
          fontSize: "大",
          editable: "0",
          字段标识: ""
        },
      },

      init() {
        this.on('change:attributes:fontSize', this.fontSizeChange);
        this.on('change:attributes:下划线', this.fontSizeChange);
        this.on('change:attributes:加粗', this.fontSizeChange);
        this.on('change:attributes:editable', this.editableChange);
        this.on('change:attributes:文本内容', this.textChange);
        this.on('change:attributes:type', this.typeChange);
      },

      editableChange() {
        const component = editor.getSelected();
        const sm = editor.StyleManager;
        const wrapper = editor.DomComponents.getWrapper();
        if (component.getTrait('editable').props().value === 'dynamic') {
          component.removeTrait('文本内容')
          component.removeTrait('字段标识')
          component.removeTrait('type')
          component.addTrait({
            name: '字段标识',
            type: 'text'
          }, {
            at: 2
          });
          component.addTrait({
            type: 'select', // Type of the trait
            label: '文本类型', // The label you will see in Settings
            name: 'type', // The name of the attribute/property to use on component
            options: [{
                id: '0',
                name: '文本类型'
              },
              {
                id: '1',
                name: '数字类型'
              },
            ]
          }, {
            at: 3
          });
          this.typeChange()
        } else {
          component.removeTrait('文本内容')
          component.removeTrait('字段标识')
          component.removeTrait('type')
          component.addTrait({
            name: '文本内容',
            type: 'text'
          }, {
            at: 1
          });
        }

      },
      typeChange() {
        const component = editor.getSelected();
        const sm = editor.StyleManager;
        const wrapper = editor.DomComponents.getWrapper();
        wrapper.find('#' + component.ccid)[0].components(
          component.getTrait('type').props().value === '0' ?
          'text（字段标识）' :
          "123（字段标识）")
      },

      textChange() {
        const component = editor.getSelected();
        const wrapper = editor.DomComponents.getWrapper();
        component.getTrait('文本内容') && wrapper.find('#' + component.ccid)[0].components(`${component.getTrait('文本内容').props().value}`)
      },
      fontSizeChange() {
        const component = editor.getSelected();
        const sm = editor.StyleManager;
        const wrapper = editor.DomComponents.getWrapper();

        sm.addStyleTargets({
          'font-size': component.getTrait('fontSize').props().value * 2 + 12 + 'px'
        });
        sm.addStyleTargets({
          'text-decoration': component.getTrait('下划线').props().value ? 'underline' : ""
        });
        sm.addStyleTargets({
          'font-weight': component.getTrait('加粗').props().value ? "bold" : "normal"
        });
        // sm.addStyleTargets({
        //   'font-weight': component.getTrait('加粗').props().value ? "bold" : "normal"
        // });

      },

      // textDecorationChange(){
      //   const component = editor.getSelected();
      //   const sm = editor.StyleManager;
      //   sm.addStyleTargets({ 'text-decoration': component.getTrait('下划线').props().value?'underline':"" });
      // }


    },
  });

  domc.addType('table', {
    model: {
      defaults: {
        traits: [{
            type: 'text',
            name: 'name',
            label: '组件名称'
          }, {
            type: 'text',
            name: "tableSymbol",
            label: '表格标识',
          },
          {
            type: 'text',
            name: "height",
            label: '行高(mm)',
          },
          {
            type: 'table-attr',
            name: "row1"
          },
          {
            type: 'table-attr',
            name: "row2"
          }, {
            type: 'my-button',
            label: '新增',
            name: "add",
            full: true, // Full width button
            command: editor => alert('Hello'),
          },
        ],
        attributes: {
          tableSymbol: 'table'
        },
      },

      init() {
        this.on('change:attributes:行高', this.typeChange);
      },
      typeChange() {
        const component = editor.getSelected();
        const wrapper = editor.DomComponents.getWrapper();
        component.view.$el[0].style.height = component.getTrait('行高').props().value + 'px'
      }
    },
    view: {

    },
  });


};