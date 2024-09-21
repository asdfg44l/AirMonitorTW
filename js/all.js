//DOM
var loading=document.querySelector('.loading');
var degree=document.querySelector('.degree');
var placeTitle=document.querySelector('.location');   //標題
var select=document.getElementById('location');  //選單
var time =document.querySelector('.time');
var detailTitle=document.querySelector('.detailTitle');
var detail=document.querySelectorAll('.detail .number');
var infoList=document.querySelector('.infoList');
// eventListener
select.addEventListener('change',function(e){
    e.preventDefault();
    updateAll(e.target.value);
});
infoList.addEventListener('click',function(e){
    e.preventDefault();
    if(e.target.nodeName == 'A'){
        updataDetail(e.target.textContent);
    }else{return};
});
//catch data
var url='https://data.moenv.gov.tw/api/v2/aqx_p_432?api_key=fb961fa0-9fb5-4ff4-ac24-f2926ebe10de';

fetch(url,{})
  .then((response)=>{
      return response.json();
}).then((data)=>{
  console.log(data.records);
  
   getData(data.records);        //save data
   updateAll('新北市');  //更新所有頁面 ( datail, infoList) 
}).then(()=>{
   loading.style.display='none';  //待資料渲染至頁面後，關閉 loading page
}).catch((err)=>{
    console.log(err);
  });
//儲存色彩資訊
var colors=[
  {
    status:'良好',
    color:'#95F084'
  },
  {
    status:'普通',
    color:'#FFE695'
  },
  {
    status:'對敏感族群不健康',
    color:'#FFAF6A'
  },
  {
    status:'對所有族群不健康',
    color:'#FF5757'
  },
  {
    status:'非常不健康',
    color:'#9777FF'
  },
  {
    status:'危害',
    color:'#AD1774'
  }
];
//套用 degree色彩
for(let i=0;i<degree.children.length;i++){
    degree.children[i].style.backgroundColor=colors[i].color;
  }
//儲存資料，並將地點存入新陣列中
var datalist;
function getData(data){
  datalist=data;
  let location= new Set();
  for(let i=0;i<datalist.length;i++){
    location.add(datalist[i].county)
  };
  addInSelect(location);    //將地點加入選單
};
//將地點加入選單中
function addInSelect(location){
    location.forEach(element => {
        let option=document.createElement('option');
        option.setAttribute('value',element);
        option.innerHTML=element;
        select.append(option);
    });
        
}
//更新 infoDetail
function updataDetail(place){
    
    datalist.find((item)=>{
        if(item.sitename == place){
            //將各項空污指標存入陣列中
            let data=[]
            data.push(item.o3,item.pm10,item['pm2.5'],item.co,item.so2,item.no2);
            //更新 detailTitle
            detailTitle.children[0].innerHTML=place;  //更新地點
            detailTitle.children[1].innerHTML=item.aqi; //更新分數

            //上色
            let colorList=colors.find((el)=>{
                       if(el.status == item.status){
                           return el;
                       }
            });
            detailTitle.children[1].style.backgroundColor=colorList.color;
            //將 data內的資料更新至 detail上
            for(let i=0;i<data.length;i++){
                if(data[i] == ''){data[i] ='N/A'};
                detail[i].innerHTML=data[i];
            }
            return;
        }
    });
}        
//更新所有資訊
function updateAll(location){
    //更新標題
    placeTitle.innerHTML=location;
    //更新時間
    time.innerHTML=datalist[0].publishtime+' 更新';   
    //清空 infoList
    infoList.innerHTML='';
    //更新 infoList
    let data=datalist.filter((item) =>{
        if(item.county == location){
            return item;
        }
    });
    //以 aqi 由大到小排序 
    let sortedData=data.sort((a,b) =>{
        let x=a.api;
        let y=b.aqi;
        return y-x;
    })
    
    sortedData.forEach((el) =>{
        let newList=document.createElement('li');

        if(el.aqi == '' | el.aqi == '-'){el.aqi='N/A'};
        //上色
        let colorList=colors.find((col)=>{
            if(col.status == el.Status){
                return col;
            };
        });
        //若資料內沒有 status (設備維修) 則套用此顏色
        if(colorList == undefined){
            colorList={color:'#EEEEEE'};
        }
        //組字串並更新
        let str=`<div class="infoBox">
                     <a href='#' class="place innerBox">${el.sitename}</a>
                     <div class="aqi innerBox" style="background-color:${colorList.color}">${el.aqi}</div>
                 </div>`;
        newList.innerHTML=str;
        
        infoList.appendChild(newList);
        
    });
    //更新 detail
    console.log('sortedData', sortedData);
    
    updataDetail(sortedData[0].sitename);

}
