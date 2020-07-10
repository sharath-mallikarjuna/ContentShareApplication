import React, { Component } from 'react';
import Resizer from 'react-image-file-resizer';
import { Box, Button } from 'grommet';
// import RNFetchBlob from 'rn-fetch-blob';

class AddAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            image: null,
            name: ''
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleImageChange = (event) => {
        var files = event.target.files[0];
        if (!files.type.includes('video')) {
            var test = Resizer.imageFileResizer(
                files, //file
                300,//maxWidth
                300,//maxHeight
                'JPEG', //compressFormat
                100,//quality
                0,//rotation
                uri => {//responseUriFunc
                    this.setState({
                        image: uri
                    })
                },
                'blob'//outputType  blob or base 64
            );
        }
        else {
            this.setState({
                image: files
            })
        }
        const imageFile = event.target.files[0];
        this.setState({
            name: files.name
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('image', this.state.image);
        const axios = require('axios')
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        var blobName = axios.post(`http://localhost:53615/api/fileupload/upload_asset`, form_data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(resp => {
                if (resp.status == 200)
                    // return resp.data;
                    //Step 2: Create New Asset and Variant in backend
                    blobName = resp.data
                var fileName = this.state.name;
                var title = this.state.title;
                var content = this.state.content;
                var size = this.state.image.size;
                this.props.uploadAsset(fileName, title, content, blobName, size); //blobObj
            })
            .catch(error => {
                if (error) {
                    return alert(error);
                }
            })

    };

    render() {
        return (
            <div className="widget-container">
                <form onSubmit={this.handleSubmit}>
                    <Box pad="small" gap="small">
                        <Box>
                            <input type="text" placeholder='Title' id='title' value={this.state.title} onChange={this.handleChange} required />
                        </Box>
                        <Box>
                            <input type="text" placeholder='Content' id='content' value={this.state.content} onChange={this.handleChange} required />

                        </Box>
                        <Box>
                            <input type="file"
                                id="image"
                                accept="image/png, image/jpeg, video/mp4" onChange={this.handleImageChange} required />
                        </Box>
                        <input type="submit" />
                    </Box>
                </form>
            </div >
        );
    }
}

export default AddAsset;