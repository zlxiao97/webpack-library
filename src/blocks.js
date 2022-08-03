export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const domc = editor.DomComponents;
  bm.add('text', {
    label: '文字',
    content: {
      type: 'text',
      content: 'text',
      style: {
        float:'left',
        width:'100%'
      },
      activeOnRender: 1
    },
    // media: '<svg>...</svg>',
  });
  bm.add('my-barCode', {
    label: '条码',
    content: {
      type: 'my-barCode',
      style: {
        padding: '10px',
        margin: "20px"
      },
    },
    // media: '<svg>...</svg>',
  });
  bm.add('QRCode', {
    label: '二维码',
    content: {
      type: 'my-QRCode',
      //tagName:"img",
      resizable: {
        ratioDefault: 1
      },
      content: '',
      style: {
        padding: '10px',
        margin: "20px"
      },
    },
    // media: '<svg>...</svg>',
  });
  bm.add('my-table', {
    label: '表格',
    type: 'table',
    content: `<table style="width:100%;padding:5px">
        <tr>
          <td style=" border: 1px dashed;height:20px;">名称</td>
          <td style=" border: 1px dashed;height:20px">单价</td>
        </tr>
        <tr>
        <td style=" border: 1px dashed;height:20px"></td>
        <td style=" border: 1px dashed;height:20px"></td>
      </tr>
      </table>`,
    style: {
    },
    activeOnRender: 1
    // media: '<svg>...</svg>',
  });
  bm.add('bitmap', {
    label: '位图',
    content: {
      type: 'image',
      content: '',
      style: {
        padding: '10px',
        margin: "20px",
        display: 'inline-block'
      },
      activeOnRender: 1
    },
    // media: '<svg>...</svg>',
  });
  bm.add('cutter', {
    label: '切刀',
    content: {
      type: 'my-cutter',
      style: {
        width: '100%',
        textAlign: 'center'
      },
      activeOnRender: 1
    },
    //media: '<div></div>',
  });
  // bm.add('td', {
  //   label: '单元格',
  //   content: {
  //     type: 'cell',
  //     style: {
       
  //       textAlign: 'center'
  //     },
  //     activeOnRender: 1
  //   },
  //   //media: '<div></div>',
  // });

}