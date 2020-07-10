import React from 'react';
import FileManager, { Permissions, Toolbar, ContextMenu, Item, FileSelectionItem, ItemView, Details, Column } from 'devextreme-react/file-manager';
import { Popup } from 'devextreme-react/popup';
import { Button, TextBox, Box } from 'devextreme-react';
import AddAsset from './AddAsset';
const allowedFileExtensions = []; //['.js', '.json', '.css'];
 
// import { addAsset, addVariant, editContact, getFolderStructure } from "./FetchAPIs";

class FolderStructure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popupAssetVisible: false,
            popupVariantVisible: false,
            popupAssetSuccessVisible: false,
            popupVariantSuccessVisible: false,
            fileItems: [],
            fileExtension: 1 //image
        };
        this.inputVariant = React.createRef();
        this.showAssetInfo = this.showAssetInfo.bind(this);
        this.hideAssetInfo = this.hideAssetInfo.bind(this);
        this.showVariantInfo = this.showVariantInfo.bind(this);
        this.hideVariantInfo = this.hideVariantInfo.bind(this);
        this.onAssetItemClick = this.onAssetItemClick.bind(this);
        this.onVariantItemClick = this.onVariantItemClick.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.fileManagerRef = React.createRef();

        this.newAssetMenuOptions = {
            items: [
                {
                    text: 'Upload Asset',
                    icon: 'plus',
                    items: [
                        {
                            text: 'Add Image',
                            extension: '.jpg'
                        },
                        {
                            text: 'Add Video',
                            extension: '.video'
                        }
                    ]
                }
            ],
            onItemClick: this.onAssetItemClick.bind(this)
        };

        this.newVariantMenuOptions = {
            items: [
                {
                    text: 'Add Variant',
                    icon: 'file',
                }
            ],
            onItemClick: this.onVariantItemClick.bind(this)
        };
    }

    componentDidMount() {
        this.GetFolderStructure();
    }

    render() {
        return (
            <React.Fragment>
                <FileManager
                    ref={this.fileManagerRef}
                    // fileSystemProvider={this.state.fileItems}
                    fileSystemProvider={fileItems}
                    onContextMenuItemClick={this.onItemClick}
                    style={{"background":"orange", "border-radius": "5px"}}
                    // height={450}
                    >
                    <Permissions
                        create={true}
                        delete={true}
                        rename={true}
                        download={true}>
                    </Permissions>
                    <ItemView showParentFolder={false}
                    >
                        <Details >
                            <Column dataField="thumbnail"></Column>
                            <Column dataField="name"></Column>
                        </Details>
                    </ItemView>
                    <Toolbar>
                        <Item name="showNavPane" visible="false" />
                        <Item name="separator" />
                        <Item widget="dxMenu" location="before" options={this.newVariantMenuOptions} />
                        <Item widget="dxMenu" location="before" options={this.newAssetMenuOptions} />
                        <Item name="refresh" />
                        <Item name="separator" location="after" />
                        <Item name="switchView" />
                    </Toolbar>
                    <ContextMenu background="darkcyan">
                        <Item name="refresh" />
                    </ContextMenu>
                </FileManager>

                <div id="assetContainer">
                    <Popup
                        style={{ background:"darkcyan" }}
                        visible={this.state.popupAssetVisible}
                        onHiding={this.hideAssetInfo}
                        dragEnabled={true}
                        closeOnOutsideClick={true}
                        showTitle={true}
                        title="Asset"
                        width={450}
                        height="auto"
                    >
                        <div>
                            <AddAsset uploadAsset={this.uploadAsset.bind()} /></div>
                    </Popup>
                </div>
                <div id="variantContainer">
                    <Popup
                        visible={this.state.popupVariantVisible}
                        onHiding={this.hideVariantInfo}
                        dragEnabled={true}
                        // closeOnOutsideClick={true}
                        showTitle={true}
                        title="Add new Variant"
                        width={300}
                        height="auto"
                    >
                        <div className="widget-container">
                            <div className="content" style={{ display: 'block', margin: "8px" }}>
                                <TextBox id="addVariant" placeholder="Enter Variant value" ref={this.inputVariant} />
                            </div>
                            <div >
                                <Button
                                    width="auto"
                                    type="submit"
                                    text="Create"
                                    type="success"
                                    stylingMode="contained"
                                    onClick={this.addVariant}
                                />
                            </div>
                        </div>
                    </Popup>
                </div>
                <div id="assetSuccessContainer">
                    <Popup
                        visible={this.state.popupAssetSuccessVisible}
                        onHiding={this.hideAssetSuccessInfo}
                        showTitle={true}
                        title="Success"
                        width={250}
                        height="auto"
                    >
                        <div>New Asset added successfully !</div>
                    </Popup>
                </div>
                <div id="variantSuccessContainer">
                    <Popup
                        visible={this.state.popupVariantSuccessVisible}
                        onHiding={this.hideVariantSuccessInfo}
                        showTitle={true}
                        title="Success"
                        width={250}
                        height="auto"
                    >
                        <div> Variant created successfully !</div>
                    </Popup>
                </div>

            </React.Fragment >
        );
    }
    //Reload tree structure
    get fileManager() {
        if(this.fileManagerRef.current!=null)
        return this.fileManagerRef.current.instance;
    }

    //Add new Variant
    onVariantItemClick() {
        this.showVariantInfo();
    }

    addVariant = () => {
        debugger;
        var variantName = this.inputVariant.current.instance._changedValue;
        // ReactDOM.findDOMNode(this.refs.inputVariant).value;
        const currentDirectory = this.fileManager.getCurrentDirectory();
        var newItem = {
            parent_id: currentDirectory.dataItem ? currentDirectory.dataItem.id : null,
            name: variantName,
            isDirectory: true,
            size: 0
        };
        this.addVariantAPI(newItem);
        // this.GetFolderStructure();

    }

    onAssetItemClick({ itemData }) {
        if (itemData.extension) {
            this.chooseFile(itemData.extension);
        }
    }
    chooseFile(extn) {
        //TODO : Can add multiple extensions n set type id accordingly
        var assetTypeId = 0;
        if (extn == ".jpg")
            assetTypeId = 1 //Image 
        else
            assetTypeId = 2 // Video

        this.setState({
            fileExtension: assetTypeId
        })
        this.showAssetInfo();
    }

    uploadAsset = (fileName, title, content, blobName,size) => {
        const currentDirectory = this.fileManager.getCurrentDirectory();
        var newItem = {
            parent_id: currentDirectory.dataItem ? currentDirectory.dataItem.id : null,
            name: fileName,
            isDirectory: false,
            size: size,
            title: title,
            content: content,
            assetTypeId: this.state.fileExtension,
            blobName: blobName
        };
        this.addAsset(newItem);
        this.GetFolderStructure();
    }
    showAssetInfo() {
        this.setState({
            popupAssetVisible: true
        });
    }

    hideAssetInfo() {
        this.setState({
            popupAssetVisible: false
        });
    }

    showVariantInfo() {
        this.setState({
            popupVariantVisible: true
        });
    }

    hideVariantInfo() {
        this.setState({
            popupVariantVisible: false
        });
    }
    showAssetSuccessInfo = () => {
        this.setState({
            popupAssetSuccessVisible: true
        });
    }

    hideAssetSuccessInfo = () => {
        this.setState({
            popupAssetSuccessVisible: false
        });
    }

    showVariantSuccessInfo = () => {
        this.setState({
            popupVariantSuccessVisible: true
        });
    }

    hideVariantSuccessInfo = () => {
        this.setState({
            popupVariantSuccessVisible: false
        });
    }

    //TODO : React Redux for state management and separation of concept

    GetFolderStructure() {
        const APIURL = "http://localhost:53615/api/assetmanagement";
        fetch(`${APIURL}`, {
        }).then((response) => response.json())
            .then((data) => {
                this.setState({
                    fileItems: data
                });
                this.fileManager.refresh();
            });
    }

    addVariantAPI = async (variant) => {
        debugger;
        const axios = require('axios')
        axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

        axios.post(`http://localhost:53615/add_variant`, variant,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(resp => {
                if (resp.status == 200) {
                    console.log("Variant added successfully");
                    this.hideVariantInfo();
                    // this.GetFolderStructure();
                    this.showVariantSuccessInfo();

                }
            })
            .catch(error => {
                if (error) {
                    return error;
                }
            })
    };

    addAsset = async (data) => {
        const axios = require('axios')
        axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

        axios.post(`http://localhost:53615/add_asset`, data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(resp => {
                if (resp.status == 200) {
                    console.log("Asset added successfully");
                    this.hideAssetInfo();
                    // this.GetFolderStructure();
                    this.showAssetSuccessInfo();
                }
            })
            .catch(error => {
                if (error) {
                    return alert(error);
                }
            })
    };
   
}

const fileItems = [
    {
        "id": 1,
        "name": "Clients",
        "parentId": null,
        "isDirectory": true,
        "items": [
            {
                "id": 2,
                "name": "Variants",
                "parentId": 1,
                "isDirectory": true,

            }
        ]
    }
];


export default FolderStructure;
