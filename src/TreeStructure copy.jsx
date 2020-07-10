import React from 'react';
import renderHTML from 'react-render-html';
import { TreeView, ContextMenu, List } from 'devextreme-react';
import { Box, Button } from 'grommet';

class TreeStructure extends React.Component {
  constructor(props) {
    super(props);
    this.contextMenuRef = React.createRef();
    this.treeViewRef = React.createRef();

    this.state = {
      currentItem: Object.assign({}, products[0]),
      value: 'contains', //or startswith,
      menuItems: menuItems,
      logItems: [],
      selectedTreeItem: undefined,
      overviewTree:[]
    };
    this.selectItem = this.selectItem.bind(this);
    this.treeViewItemContextMenu = this.treeViewItemContextMenu.bind(this);
    this.contextMenuItemClick = this.contextMenuItemClick.bind(this);
  }
  componentDidMount() {
    this.GetOverviewData();
}

  render() {
    const { currentItem } = this.state;
    return (
      <React.Fragment>
        <div className="form">

          <TreeView id="treeview"
            items={products}
            // dataStructure="plain"
            displayExpr="text"
            parentIdExpr="categoryId"
            keyExpr="ID"
            width={300}
            searchMode={this.state.value}
            searchEnabled={true}
            ref={this.treeViewRef}
            onItemContextMenu={this.treeViewItemContextMenu}
            onItemClick={this.selectItem} />

          {
            currentItem.price &&
            <div id="product-details">
              <Box>            {/* <img src={currentItem.image} /> */}
                <div className="name">{currentItem.text}</div>
                <div className="price">{`$${currentItem.price}`}</div>
                <input id="newVariant" />
                <Button>Add Variant</Button>
              </Box>

            </div>
          }
          <div className="log-container">
            <div><i className="icon dx-icon-clock"></i>&nbsp;Operations log:</div>
            <List
              id="log"
              width={400}
              height={300}
              showScrollbar="always"
              items={this.state.logItems} />
          </div>
          <ContextMenu
            ref={this.contextMenuRef}
            dataSource={this.state.menuItems}
            target="#treeview .dx-treeview-item"
            onItemClick={this.contextMenuItemClick} />

        </div>
      </React.Fragment>
    );
  }
  selectItem(e) {
    // alert("hi " + JSON.stringify(e.itemData.id) + " a " + e.itemData.text)
    this.setState({
      currentItem: Object.assign({}, e.itemData)
    });
  }

  get treeView() {
    return this.treeViewRef.current.instance;
  }

  get contextMenu() {
    return this.contextMenuRef.current.instance;
  }

  treeViewItemContextMenu(e) {
    this.setState({
      selectedTreeItem: e.itemData,
    });

    const isProduct = e.itemData.price !== undefined;
    this.contextMenu.option('items[1].visible', isProduct);
    this.contextMenu.option('items[0].visible', isProduct);
    this.contextMenu.option('items[1].visible', !isProduct);
    this.contextMenu.option('items[0].visible', !isProduct);
  }

  contextMenuItemClick(e) {
    let logEntry = '';
    switch (e.itemData.id) {
      case 'expand': {
        logEntry = `The '${this.state.selectedTreeItem.text}' group was expanded`;
        this.treeView.expandItem(this.state.selectedTreeItem.id);
        break;
      }
      case 'collapse': {
        logEntry = `The '${this.state.selectedTreeItem.text}' group was collapsed`;
        this.treeView.collapseItem(this.state.selectedTreeItem.id);
        break;
      }
      case 'details': {
        logEntry = `Details about '${this.state.selectedTreeItem.text}' were displayed`;
        break;
      }
      case 'copy': {
        logEntry = `Information about '${this.state.selectedTreeItem.text}' was copied`;
        break;
      }
    }
    const logItems = this.state.logItems.concat([logEntry]);

    this.setState({
      logItems: logItems
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
            // this.fileManager.refresh();
        });
}

}

var thisIsMyCopy = renderHTML('<p>copy copy copy <strong>strong copy</strong></p>');

const products1 = [{
  ID: '1',
  name: 'Stores',
  expanded: true
}, {
  ID: '1_1',
  categoryId: '1',
  name: 'Super Mart of the West',
  expanded: true
}, {
  ID: '1_1_1',
  categoryId: '1_1',
  name: 'Video Players'
}, {
  ID: '1_1_1_1',
  categoryId: '1_1_1',
  name: 'HD Video Player',
  icon: 'images/products/1.png',
  price: 220
}, {
  ID: '1_1_1_2',
  categoryId: '1_1_1',
  name: 'SuperHD Video Player',
  icon: 'images/products/2.png',
  price: 270
}, {
  ID: '1_1_2',
  categoryId: '1_1',
  name: 'Televisions',
  expanded: true
}, {
  ID: '1_1_2_1',
  categoryId: '1_1_2',
  name: 'SuperLCD 42',
  icon: 'images/products/7.png',
  price: 1200
}, {
  ID: '1_1_2_2',
  categoryId: '1_1_2',
  name: 'SuperLED 42',
  icon: 'images/products/5.png',
  price: 1450
}, {
  ID: '1_1_2_3',
  categoryId: '1_1_2',
  name: 'SuperLED 50',
  icon: 'images/products/4.png',
  price: 1600
}, {
  ID: '1_1_2_4',
  categoryId: '1_1_2',
  name: 'SuperLCD 55',
  icon: 'images/products/6.png',
  price: 1750
}, {
  ID: '1_1_2_5',
  categoryId: '1_1_2',
  name: 'SuperLCD 70',
  icon: 'images/products/9.png',
  price: 4000
}, {
  ID: '1_1_3',
  categoryId: '1_1',
  name: 'Monitors'
}, {
  ID: '1_1_3_1',
  categoryId: '1_1_3',
  name: '19"',
}, {
  ID: '1_1_3_1_1',
  categoryId: '1_1_3_1',
  name: 'DesktopLCD 19',
  icon: 'images/products/10.png',
  price: 160
}, {
  ID: '1_1_4',
  categoryId: '1_1',
  name: 'Projectors'
}, {
  ID: '1_1_4_1',
  categoryId: '1_1_4',
  name: 'Projector Plus',
  icon: 'images/products/14.png',
  price: 550
}, {
  ID: '1_1_4_2',
  categoryId: '1_1_4',
  name: 'Projector PlusHD',
  icon: 'images/products/15.png',
  price: 750
}
];


const products = [{
  id: '1',
  text: 'Stores',
  expanded: true,
  items: [{
    id: '1_1',
    categoryId: '1',
    text: 'Super Mart of the West',
    expanded: true,
    items: [{
      id: '1_1_1',
      categoryId: '1_1',
      text: 'Video Players',
      items: [{
        id: '1_1_1_1',
        categoryId: '1_1_1',
        text: 'HD Video Player',
        price: 220,
        image: 'images/products/1.png'
      }]
    }, {
      id: '1_1_2',
      categoryId: '1_1',
      text: 'Televisions',
      expanded: true,
      items: [{
        id: '1_1_2_1',
        categoryId: '1_1_2',
        text: 'SuperLCD 42',
        image: 'images/products/7.png',
        price: 1200
      }, {
        id: '1_1_2_2',
        categoryId: '1_1_2',
        text: 'SuperLED 42',
        image: 'images/products/5.png',
        price: 1450
      }]
    }]

  }, {
    id: '1_2',
    categoryId: '1',
    text: 'Braeburn',
    items: [{
      id: '1_2_1',
      categoryId: '1_2',
      text: 'Video Players',
      items: [{
        id: '1_2_1_1',
        categoryId: '1_2_1',
        text: 'HD Video Player',
        image: 'images/products/1.png',
        price: 240
      }]
    }]

  }]

}];



const menuItems = [
  { id: 'addVariant', text: 'Add Variant' },
  { id: 'addAsset', text: 'Add Asset' },
];


export default TreeStructure;