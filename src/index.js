import loadComponents from './components';
import loadBlocks from './blocks';
import en from './locale/en';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import $ from 'jquery'

export default (id,callback ,opts = {}) => {
  const options = {
    ...{
      i18n: {},
      // default options
    },
    ...opts
  };
 
  const closeModal = (e) => {
    let name = $("#title").val()
    let size = $("#size:checked").val()
    editor.DomComponents.getWrapper().append(`
          <table id="isox" style="box-sizing: border-box; height: 70vh; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: ${(size || 58) * 4}px;text-align:center">
            <tr id="i1rd" style="box-sizing: border-box;text-align:center">
              <td id="ifo1" style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;text-align:center;display:" valign="top">
                <div id="i3yc" style="box-sizing: border-box; padding: 10px; margin: 43px 0 0 0; text-decoration: underline; font-style: italic; text-align: center;">${name}
                </div>
              </td>
            </tr>
          </table>`)
    editor.Modal.close();
  };

  const saveJSON = (data, filename) => {
    if (!data) {
      alert("保存的数据为空");
      return;
    }
    if (!filename) filename = "tips.json";
    if (typeof data === "object") {
      data = JSON.stringify(data, undefined, 4);
    }
    var blob = new Blob([data], {
        type: "text/json"
      }),
      e = document.createEvent("MouseEvents"),
      a = document.createElement("a");
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    e.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    a.dispatchEvent(e);
  };

  const JsonToHtml = (json) => {
    var html = ''
    json.map((item) => {
      switch (item.type) {
        case 'text':
          html += `<div
            data-gjs-type="text"
            draggable="true"
            type="text"
            style='width:${item.width * 4}px;height:${item.height * 4}px;'
            fontsize="${item.specificationDTO.fontSize * 2 + 12}px"
            contenteditable="false"
          >
            ${item.specificationDTO.demoValue}
          </div>`
          break;
        case 'my-QRCode':

          break;
        case 'my-cutter':

          break;
        case 'my-barCode':
          break;
        case 'image':

          break;
        case 'table':
          temp = {
              type: "table",
              name: item.attributes.tableSymbol,
              width: width,
              height: height,
              upperLeftX: left,
              upperLeftY: top,
              lowerRightX: left + width,
              lowerRightY: top + height,
              specificationDTO: {
                dataIdentifier: "orderTable",
                dataOrigin: "dynamic",
                dataType: "text",
                specificationDTOList: item.components[0].components[0].components.map((item1) => {
                  return {
                    bytesSizePerLine: 16,
                    dataIdentifier: item1.attributes.inputSymbol,
                    dataOrigin: "dynamic",
                    dataType: item1.attributes.inputType,
                    name: item1.components[0].content,
                    startPrintingIdxFromLeft: 0,
                    demoValue: "GP-3120TU"
                  }
                })
              },
            },
            html += `<table style="width:100%;padding:5px">
            <tr>
              ${item.specificationDTO.specificationDTOList.map((item1) => {
              return `<td style=" border: 1px dashed;height:20px">${item1.name}</td>`
            })}
            </tr>
            <tr>
              ${item.specificationDTO.specificationDTOList.map((item1) => {
              return `<td style=" border: 1px dashed;height:20px"></td>`
            })}
            </tr>
          </table>`
          componentDTOList.push(temp)
          break;
        default:
          break;
      }


    })
  }

  const importFileJSON = (ev) => {
    return new Promise((resolve, reject) => {
      const fileDom = ev,
        file = fileDom.files[0];

      // 格式判断
      if (file.type !== 'application/json') {
        reject('仅允许上传json文件');
      }
      // 检验是否支持FileRender
      if (typeof FileReader === 'undefined') {
        reject('当前浏览器不支持FileReader');
      }

      // 执行后清空input的值，防止下次选择同一个文件不会触发onchange事件
      fileDom.value = '';

      // 执行读取json数据操作
      const reader = new FileReader();
      reader.readAsText(file); // 读取的结果还有其他读取方式，我认为text最为方便

      reader.onerror = (err) => {
        reject('json文件解析失败', err);
      }

      reader.onload = () => {
        const resultData = reader.result;
        if (resultData) {
          try {
            const importData = JSON.parse(resultData);
            JsonToHtml(importData)
            resolve(importData);
          } catch (error) {
            reject('读取数据解析失败', error);
          }
        } else {
          reject('读取数据解析失败', error);
        }
      }
    });

  }


  window.editor = grapesjs.init({
    height: '100%',
    container: '#' + id,
    showOffsets: true,
    fromElement: true,
    noticeOnUnload: false,
    storageManager: false,
    // plugins: ['y'],
    // pluginsOpts: {
    //   'y': { /* Test here your options  */ }
    // },
  });


  editor.Modal.open({
    title: '创建模板', // string | HTMLElement
    content: `<div>
        <label>标题:</label> <input id="title" />
        </div>
        <div>
          <label>画布大小</label><input id="size" type="radio" value="58" />58mm<input id="size" type="radio" value="88" />88mm
        </div>
        <div><button  id='closeModal' ">确定</button></div>`, // string | HTMLElement
  });

  document.getElementById('closeModal').addEventListener('click', function (e) {
    closeModal()
  })

  $("body").append(`<input style="display:none" type="file" name="file" id="importPut" onchange='importFileJSON(this)'>`)

  var newPanel = editor.Panels.addPanel({
    id: 'myNewPanel',
    visible: true,
    buttons: [{
      id: 'show-json',
      className: 'btn-show-json',
      label: '导出',
      attributes: {
        style: 'margin-left: 200px;'
      },
      context: 'show-json',
      command(editor) {
        //     editor.Modal.setTitle('Components JSON')
        //       .setContent(`<textarea style="width:100%; height: 250px;">
        //   ${JSON.parse(JSON.stringify(editor.getComponents()))[0].components[0].components[0].components[0].components}
        // </textarea>`)
        //       .open();

        let cpms = JSON.parse(JSON.stringify(editor.getComponents()))[0].components[0].components[0].components[0].components
        var componentDTOList = []
        cpms.map((item) => {
          {
            var domc = $(".gjs-frame")[0].contentWindow.document
            var width = domc.getElementById(item.attributes.id).offsetWidth / 4
            var height = domc.getElementById(item.attributes.id).offsetHeight / 4
            var left = domc.getElementById(item.attributes.id).offsetLeft / 4
            var top = domc.getElementById(item.attributes.id).offsetTop / 4
            let temp
            switch (item.type) {
              case 'text':
                var specificationDTO = {}
                if (item.attributes ?.editable === "dynamic") {
                  specificationDTO = {
                    alignment: "middle",
                    dataIdentifier: item.attributes.字段标识,
                    dataOrigin: 'dynamic',
                    dataType: "text",
                    demoValue: item.components[0].content,
                    fontSize: item.attributes ?.fontSize * 1 || 2
                  }
                } else {
                  specificationDTO = {
                    alignment: "middle",
                    dataIdentifier: item.attributes.字段标识,
                    dataOrigin: 'flex',
                    dataType: "text",
                    fixedDataValue: item.attributes.文本内容 || item.components[0].content,
                    fontSize: item.attributes ?.fontSize * 1 || 2,
                  }
                }

                temp = {
                  type: "text",
                  name: item.attributes.name || 'text',
                  width: width,
                  height: height,
                  upperLeftX: left,
                  upperLeftY: top,
                  lowerRightX: left + width,
                  lowerRightY: top + height,
                  specificationDTO: specificationDTO
                }
                componentDTOList.push(temp)
                break;
              case 'my-QRCode':
                temp = {
                  type: "text",
                  name: "标题",
                  width: width,
                  height: height,
                  upperLeftX: left,
                  upperLeftY: top,
                  lowerRightX: left + width,
                  lowerRightY: top + height,
                  specificationDTO: {
                    alignment: "middle",
                    dataIdentifier: "title",
                    dataOrigin: "dynamic",
                    dataType: "text",
                    demoValue: item.components[0].content,
                    fontSize: item.attributes.fontSize.split("px")[0] / 4 || 2
                  },
                }
                componentDTOList.push(temp)
                break;
              case 'my-cutter':
                temp = {
                  type: "text",
                  name: "标题",
                  width: width,
                  height: height,
                  upperLeftX: left,
                  upperLeftY: top,
                  lowerRightX: left + width,
                  lowerRightY: top + height,
                  specificationDTO: {
                    alignment: "middle",
                    dataIdentifier: "title",
                    dataOrigin: "dynamic",
                    dataType: "text",
                    demoValue: item.components[0].content,
                    fontSize: item.attributes.fontSize.split("px")[0] / 4 || 2
                  },
                }
                componentDTOList.push(temp)
                break;
              case 'my-barCode':
                temp = {
                  type: "text",
                  name: "标题",
                  width: width,
                  height: height,
                  upperLeftX: left,
                  upperLeftY: top,
                  lowerRightX: left + width,
                  lowerRightY: top + height,
                  specificationDTO: {
                    alignment: "middle",
                    dataIdentifier: "title",
                    dataOrigin: "dynamic",
                    dataType: "text",
                    demoValue: item.components[0].content,
                    fontSize: item.attributes.fontSize.split("px")[0] / 4 || 2
                  },
                }
                componentDTOList.push(temp)
                break;
              case 'image':
                temp = {
                  type: "text",
                  name: "标题",
                  width: width,
                  height: height,
                  upperLeftX: left,
                  upperLeftY: top,
                  lowerRightX: left + width,
                  lowerRightY: top + height,
                  specificationDTO: {
                    alignment: "middle",
                    dataIdentifier: "title",
                    dataOrigin: "dynamic",
                    dataType: "text",
                    demoValue: item.components[0].content,
                    fontSize: item.attributes.fontSize.split("px")[0] / 4 || 2
                  }
                }
                componentDTOList.push(temp)
                break;
              case 'table':
                temp = {
                  type: "table",
                  name: item.attributes.name || 'table',
                  width: width,
                  height: height,
                  upperLeftX: left,
                  upperLeftY: top,
                  lowerRightX: left + width,
                  lowerRightY: top + height,
                  specificationDTO: {
                    dataIdentifier: item.attributes.tableSymbol,
                    dataOrigin: "dynamic",
                    dataType: "text",
                    specificationDTOList: item.components[0].components[0].components.map((item1, index) => {
                      return {
                        bytesSizePerLine: 16,
                        dataIdentifier: item1.attributes.inputSymbol || 'table_Row' + (index + 1),
                        dataOrigin: "dynamic",
                        dataType: item1.attributes.inputType || 'text',
                        name: item1.attributes.inputName || item1.components[0].content,
                        startPrintingIdxFromLeft: 0,
                        // demoValue: "GP-3120TU"
                      }
                    })
                  },
                }
                componentDTOList.push(temp)
                break;
              default:
                break;
            }


          }
        })
        console.log(componentDTOList)
        var json = {
          scene: "sale",
          url: "https://speech-solution-daily.oss-cn-shanghai.aliyuncs.com/printing_scene/sale.png?versionId=CAEQFRiBgICr7LzfwhciIDZiZjdiYzc4NTA4ZTQyZjZiOGQxZmFkNjM4YjY5ODAy",
          sceneName: "销售",
          printingTemplateMap: {
            [$("#size:checked").val() * 1]: componentDTOList
          }
        }
        callback(json)
      },
    }, {
      id: 'imort-json',
      className: 'btn-import-json',
      label: '导入',
      context: 'show-json',
      command(editor) {
        $("#importPut").click()
      }
    }],
  });

  // editor.on('run', () =>
  //   window.element.render('collapse')
  // );

  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
  // Load i18n files
  editor.I18n && editor.I18n.addMessages({
    en,
    ...options.i18n,
  });
};