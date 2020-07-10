import { Crosshair } from "devextreme-react/chart";


const APIURL = "http://localhost:53615/api/assetmanagement";

export const getFolderStructure = async () => {
    debugger;
    return await fetch(`${APIURL}`, {
    }).then((response) => response.json())
        .then((data) => { return data });
};

export const addVariant = async (variant) => {
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
            if (resp.status == 200){
                console.log("Variant added successfully");
                return "success";
            }
        })
        .catch(error => {
            if (error) {
                return error;
            }
        })
};
// {"parent_id":4,"name":"Fb","isDirectory":true,"size":0}
export const uploadAsset = async (data) => {
    const res = await fetch(`${APIURL}/upload_asset`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        body: data
    });
    return res.json();
};

export const addAsset = async (data) => {
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
            let result = resp.data;
            alert(result);
        })
        .catch(error => {
            if (error) {
                return alert(error);
            }
        })
};

