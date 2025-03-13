import { useEffect, useState } from 'react';
import { supabase } from '../../shared/supabaseClient';
import'./Statistic.css'
import { LoadingOutlined } from '@ant-design/icons';
import { Progress, Spin } from 'antd';


function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  switch (dayOfWeek) {
    case 0:
      return 'Воскресенье';
    case 1:
      return 'Понедельник';
    case 2:
      return 'Вторник';
    case 3:
      return 'Среда';
    case 4:
      return 'Четверг';
    case 5:
      return 'Пятница';
    case 6:
      return 'Суббота';
    default:
      return 'Некорректная дата';
  }
}








function StatisticPage() {
  const [dataMeet, setDataMeet] = useState([{status:'',places:''}]);
  const [dataUser, setDataUser] = useState(new Array<Object>());
  const [dataPlaces, setDataPlaces] = useState( new Array<Object>());
  const [load, setLoad] = useState(true);
  const [dataMeetCntActiv, setDataMeetCntActiv] = useState(0);
  const [dataMeetCntComp, setDataMeetCntComp] = useState(0);
  let tempArr = [0,0,0,0,0,0,0]
  const [weekday, setWeekday] = useState(tempArr);

  useEffect(() => {
    const fetchDataUser = async () => {
      // const { data } = await supabase.from('match_results').select();
      const { data } = await supabase.from('users').select();
      if (data) {
        // console.log(data);
        setDataUser(data);
        setLoad(false);
      }
    };
    fetchDataUser();
    const fetchDataMeet = async () => {
      const { data } = await supabase.from('match_results').select();
      setDataMeetCntActiv(0);
      setDataMeetCntComp(0);
      if (data) {
        let tempData = data.map((item)=>{
          let tempObj={
            key: item.id,
            status: item.status,
            places: item.place_id,
            date_meet: item.meeting_datetime.replace("T", " "),
            weekDay: getDayOfWeek(item.meeting_datetime),
            created_at: item.created_at.replace("T", " "),
            updated_at: item.updated_at.replace("T", " ")
          }
          if (tempObj.status === 'active') { 
          setDataMeetCntActiv((prevcount:number)=>prevcount+=1);
          }
          if (tempObj.status === 'complete') {
            setDataMeetCntComp((prevcount:number)=>prevcount+=1);
          }
          if (tempObj.weekDay == 'Понедельник') {tempArr[1]+=1}
          if (tempObj.weekDay == 'Вторник') {tempArr[2]+=1}
          if (tempObj.weekDay == 'Среда') {tempArr[3]+=1}
          if (tempObj.weekDay == 'Четверг') {tempArr[4]+=1}
          if (tempObj.weekDay == 'Пятница') {tempArr[5]+=1}
          if (tempObj.weekDay == 'Суббота') {tempArr[6]+=1}
          if (tempObj.weekDay == 'Воскресенье') {tempArr[0]+=1}    
          setWeekday(tempArr)
          return tempObj
        })
        // console.log(tempData);
        setDataMeet(tempData);
        setLoad(false);
        tempArr = [0,0,0,0,0,0,0]
      }
    };
    fetchDataMeet()
    const fetchDataPlaces = async () => {
      const { data } = await supabase.from('places').select();
      if (data) {
        // console.log(data);
        let tempData = data.map((item:any)=>{
          let tempObj={
            key: item.id,
            title: item.title,
            meetCnt: 0,
            created_at: item.created_at.replace("T", " "),
            updated_at: item.updated_at.replace("T", " ")
          }
          return tempObj
        })
        // console.log(tempData);
        setDataPlaces(tempData.sort((a, b) => a.key - b.key));
        setLoad(false);
      }
    };
    fetchDataPlaces()
  }, []);
  
  return (
    <div style={{display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'}}>
      <div className="StatisticWrapper">
      <div className="StatisticContainer">
        <div>
          <h3>Количество пользователей</h3>
          <span>{dataUser.length}</span>
        </div>
        <div>
          <h3>Количество активных пользователей</h3>
          <span>{dataUser.length}</span>
        </div>
        </div>    
        <div className="StatisticContainer">
        <div>
          <h3>Количество активных встреч</h3>
          <span>{dataMeetCntActiv}</span>
        </div>
        <div>
          <h3>Количество завершенных встреч</h3>
          <span>{dataMeetCntComp}</span>
        </div>
        </div>
      </div>
      <div className="StatisticWrapper">
      <div className="StatisticContainer">
        {load ? <div className='loadingContainer'> <Spin indicator={<LoadingOutlined  spin />} /> </div>
        :
        <div>
          <h3>Динамика мероприятий по дням недели</h3>
          <span>Понедельник<Progress percent={Math.round((weekday[1]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[1]}`}/></span>
          <span>Вторник<Progress percent={Math.round((weekday[2]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[2]}`}/></span>
          <span>Среда<Progress percent={Math.round((weekday[3]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[3]}`}/></span>
          <span>Четверг<Progress percent={Math.round((weekday[4]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[4]}`}/></span>
          <span>Пятница<Progress percent={Math.round((weekday[5]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[5]}`}/></span>
          <span>Суббота<Progress percent={Math.round((weekday[6]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[6]}`}/></span>
          <span>Воскресенье<Progress percent={Math.round((weekday[0]/dataMeet.length)*100) }  showInfo={true} format={() => `${weekday[0]}`}/></span>
        </div>
      }
      </div>
      <div className="StatisticContainer">
        <div>
        <h3>Количетсво встреч по кофейням</h3>
        <div className="StatisticList">
          {dataPlaces.map((item:any,index)=>{
            item.meetCnt = 0;
            for (let i = 0; i < dataMeet.length; i++) {
              if (item.key == dataMeet[i].places) {
                item.meetCnt+=1;
              } 
            }
            return <div className='StatisticItem' key={index}> <p>Адресс:</p> <span>{item.title}</span> <p> Количество встреч:</p> <span>{item.meetCnt}</span></div>
          })}
          </div>
        </div>
      </div>

      </div>

      
     
    </div>
  )
}
export default StatisticPage;
