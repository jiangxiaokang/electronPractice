var ipc = require('electron').ipcRenderer;

let date = new Date();//show date contents
const dateDiv = document.querySelector('.date')
dateDiv.addEventListener('click',function(){
    ipc.send('createCalenderWindow');
})

function changeDate(input_date){
    const str = `${input_date.getFullYear()}年${input_date.getMonth()+1}月${input_date.getDate()}日`
    dateDiv.innerHTML = str;
}

changeDate(date)

ipc.on('reqSendShowDate', function(event){
    //event.sender.send('actionReply', result);
    console.log('req send show date')
    event.sender.send('syncShowDate', date)
});

ipc.on('changeShowData',function(event,newDate){
    date = newDate;
    changeDate(date);
})

//drag image
const dragDiv = document.querySelector(".add-img");
const imgDiv = document.querySelector(".show-img");
dragDiv.ondragenter = (event)=>{
    event.preventDefault();
    event.stopPropagation();
}

dragDiv.ondragover = (event)=>{
    event.preventDefault();
    event.stopPropagation();
}

dragDiv.ondrop = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var files = this.files || event.dataTransfer.files;
    console.log(files[0])
    readImageAndShow(files[0],imgDiv)
};

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
        var base64Data = img.src.replace(/^data:image\/\w+;base64,/, "");
        ipc.send('saveImgAction',base64Data,file.name,date);
    });
    reader.readAsDataURL(file)
}