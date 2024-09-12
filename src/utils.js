import { orderContant } from "./contant";


export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

export function getItem(label, key, icon, children, type) {
    return {
        label,
        key,
        icon,
        children,
        type
    }
}

export const renderOptions = (arr) => {
    let results = [];
    if(arr){
        results = arr?.map((opt) => {
            return{
                value: opt,
                label: opt
            }
        })
    }
    results.push({
        label: 'Thêm type',
        value: 'add_type'
    })
    return results;
}

export const convertPrice = (price) => {
    try {
        const result = Math.floor(price)?.toLocaleString().replaceAll(',', '.');
        return `${result} VND`;
    }
    catch (error) {
        return null;
    }
}

export const initFacebookSDK = () => {
    if(window.FB){
        window.FB.XFBML.parse();
    }
    let locale = 'vi_VN';
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FB_ID,
            cookie: true,
            xfbml: true,
            version: 'v10.0',
        });
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = `//connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

export const convertDataChart = (data, type) => {
    let results = [];
    if(data){
        const arr = data.map((item) => item[type]);
        const unique = [...new Set(arr)];
        unique.forEach((item) => {
            const count = arr.filter((i) => i === item).length;
            results.push({
                name: orderContant.payment[item],
                value: count
            })
        })
    }
    return results;
}