var ipc = require('electron').ipcRenderer;

const months = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
];
//父窗口传入
let date = new Date();

const renderCalendar = () => {
  date.setDate(1);
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const month = date.getMonth();
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const cur_date = new Date();

  document.querySelector(".date h1").innerHTML = months[month];
  document.querySelector(".date p").innerHTML = date.getFullYear();

  const monthDays = document.querySelector(".days");
  const firstDayIndex = (date.getDay() + 6) % 7;
  const lastDayIndex =
    (new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay() + 6) % 7;

  const nextDays = 42 - firstDayIndex - lastDay;
  
  let days = "";
  //prev day
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="pre-date">${prevLastDay - x + 1}</div>`;
  }
  
  for (let i = 1; i <= lastDay; i++) {
    if (
      i === cur_date.getDate() &&
      date.getMonth() === cur_date.getMonth()
    ) {
      days += `<div class="today cur-month">${i}</div>`;
    } else {
      days += `<div class="cur-month">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; ++j) {
    days += `<div class="next-date">${j}</div>`;
  }
  monthDays.innerHTML = days;
  // document.querySelectorAll('.pre-date').addEventListener('click',(event)=>{
  //   //click last month
  //   console.log('click pre date');
  // })
  var click_list = document.querySelectorAll(".cur-month");
  for (let i = 0; i < click_list.length; i++) {
    click_list[i].addEventListener("click", (event) => {
      //click
      // console.log(event);
      day_num = event.path[0].innerText;
      date.setDate(day_num);
      onChooseDate();
    });
  }
  
  
  // document.querySelectorAll('.next-date').addEventListener('click',(event)=>{
  //   console.log('click next date');
  // })
};

//renderCalendar();

document.querySelector('.prev').addEventListener('click',()=>{
    date.setMonth(date.getMonth()-1)
    renderCalendar()
})

document.querySelector('.next').addEventListener('click',()=>{
    date.setMonth(date.getMonth()+1)
    renderCalendar()
})

ipc.on('sendCalenderShowDate', function(event, newDate){
  //console.log('sendCalenderShowDate ',newDate)
  date = newDate;
  renderCalendar();
})

ipc.send('reqSendShowDate');

function onChooseDate(chooseDate){
  // console.log('onChooseDate',date)
  ipc.send('onChooseDate',date);
}