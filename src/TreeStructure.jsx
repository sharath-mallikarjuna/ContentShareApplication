import React from 'react';
import renderHTML from 'react-render-html';
import { TreeView, ContextMenu, List } from 'devextreme-react';
import { Box, Button } from 'grommet';
import ReactDOM from 'react-dom';
import image_tmp from './img/b7.jpg';


class TreeStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: {},
      value: 'contains', //or startswith,
      selectedTreeItem: undefined,
      overviewTree: []
    };
    this.treeViewRef = React.createRef();
    this.selectItem = this.selectItem.bind(this);
    this.treeViewItemContextMenu = this.treeViewItemContextMenu.bind(this);
  }
  componentDidMount() {
    this.GetOverviewData();
    this.setState({
      currentItem: Object.assign({}, this.state.overviewTree[0])
    })
  }

  render() {
    const { currentItem } = this.state;
    return (
      <React.Fragment>
        <Box
            background="orange"
            width="98vw"
            height="85vh"
            pad="medium"
            round="small"
            >
        <div className="form">
          <TreeView id="treeview"
            items={fileItems}//{this.state.overviewTree}
            // dataStructure="plain"
            displayExpr="name"
            parentIdExpr="parentID"
            keyExpr="id"
            searchMode={this.state.value}
            searchEnabled={true}
            ref={this.treeViewRef}
            onItemContextMenu={this.treeViewItemContextMenu}
            onItemClick={this.selectItem} />

          {
            !currentItem.isDirectory &&
            <div id="product-details">
              <Box>
                 {/* <img src={currentItem.image} /> */}
                <div className="name">{currentItem.title}</div>
                <img src={image_tmp}/>
                <div className="price">{currentItem.content}</div>
                <div id="container"></div> 
                <input id="newVariant" />
                <Button>Add Variant</Button>
              </Box>
            </div>
          }
        </div>
        </Box>
      </React.Fragment>
    );
  }

  selectItem(e) {
    debugger;
    this.setState({
      currentItem: Object.assign({}, e.itemData)
    });
    if(!e.itemData.isDirectory && e.itemData.blobName.length>0)
       this.getImageFromContainer(e.itemData.blobName,e.itemData.title,e.itemData.content);
  }

  get treeView() {
    return this.treeViewRef.current.instance;
  }

  treeViewItemContextMenu(e) {
    this.setState({
      selectedTreeItem: e.itemData,
    });
  }

  GetOverviewData() {
    const APIURL = "http://localhost:53615/api/assetmanagement";
    fetch(`${APIURL}`, {
    }).then((response) => response.json())
      .then((data) => {
        this.setState({
          overviewTree: data
        });
      });
  }

  getImageFromContainer(blobName,title,content) {
    // var blobName = "85b1e523-43c5-4788-be2f-c4da8427b6b6"
    return fetch(`${"http://localhost:53615/api/fileupload/getblob?blobName=" + blobName}`)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            const data = result;
            const Example = ({ data }) => <div><h3>Title : {title}</h3> <img src={`data:image/jpeg;base64,${data}`} />
            <h4>Content : {content}</h4></div>
            ReactDOM.render(<Example data={data} />, document.getElementById('container'))
        });

}


}
var thisIsMyCopy = renderHTML('<p>copy copy copy <strong>strong copy</strong></p>');

const fileItems = [
  {
      "id": 1,
      "name": "Clients",
      "parentId": null,
      "isDirectory": true,
      "blobName":null,
      "items": [
          {
              "id": 2,
              "name": "Variants.png",
              "parentId": 1,
              "isDirectory": false,
              "blobName":"1eccc18d-2d18-4815-8f7f-d8a218245909"
          }
      ]
  }
];

export default TreeStructure;