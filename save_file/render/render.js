const {app} = require('@electron/remote')
const path = require('path')
//how to import remote fs?
fs = require('fs')

window.onload = ()=>{
    const dragDiv = document.querySelector(".drag-area")
    const imgDiv = document.querySelector(".show-img");

    dragDiv.ondragenter = (event)=>{
        event.preventDefault();
        event.stopPropagation();
    }
    
    dragDiv.ondragover = (event)=>{
        event.preventDefault();
        event.stopPropagation();
    }
    
    //  文件进入Div并且已经松开鼠标
    dragDiv.ondrop = function(event) {
        //  阻止浏览器默认事件
        event.preventDefault();
        event.stopPropagation();
        //  把文件传入files变量，有的浏览器需要通过event获取
        var files = this.files || event.dataTransfer.files;
        console.log(files[0])
        readImageAndShow(files[0],imgDiv)
        // 保存图片到对应目录
       // download(files[0].name)
    };
}

function readImageAndShow(file, img) {
    // 检查文件是否为图像。
    if (file.type && !file.type.startsWith('image/')) {
        console.log('File is not an image.', file.type, file);
        return;
    }
    console.log(file.name);
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        img.src = event.target.result;
        //设置保存路径
        console.log(app.getAppPath(),file.name,file.type)
        const fileDir = path.join(app.getAppPath(), '/img/');
        if(!fs.existsSync(fileDir)){
            fs.mkdir(fileDir, function(err){
                if (err) {
                    console.log('mkdir err:'+err)
                }
                else{
                    console.log('New Directory Created')
                }
            })
        }
        const filePath = path.join(fileDir, `${file.name}`);
        console.log(filePath)
        /*去掉data,url*/
        var base64Data = img.src.replace(/^data:image\/\w+;base64,/, "");
        const nD = Buffer.from(base64Data,'base64');
        fs.writeFile(filePath, nD,
           function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("保存成功！");   
         }});
    });
    reader.readAsDataURL(file)
}

function download(url,filename) {
    var element = document.createElement('a');
    element.setAttribute('href',url );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

