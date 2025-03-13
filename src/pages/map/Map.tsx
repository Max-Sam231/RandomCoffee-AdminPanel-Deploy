import React, { useEffect, useState } from 'react';
import { YMaps,Map,Placemark  } from 'react-yandex-maps';
import "./Map.css"
import { supabase } from '../../shared/supabaseClient';
import { Button, Input, Modal, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';




const MySearch = ({ arrayToSearch, searchKey }:any) => {
  const [searchText, setSearchText] = useState('');
  const [filteredArray, setFilteredArray] = useState(arrayToSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setmodalItem] = useState({key:''});
  const [inputValueEdit, setinputValueEdit] = useState('');
  const [inputValueLocation, setInputValueLocation] = useState('');
  const [inputValueLocationAdd, setInputValueLocationAdd] = useState('');
  const [inputValueAdd, setinputValueAdd] = useState('');

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValueEdit(e.target.value);
  }
  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValueAdd(e.target.value);
  }
  const handleChangeLocationAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueLocationAdd(e.target.value);
  }
  const handleChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueLocation(e.target.value);
  }
  const showModal = (item:any) => {
    setIsModalOpen(true);
    setmodalItem(item)
  };

  async function handleOk() {
    setIsModalOpen(false);
    console.log(modalItem);
    console.log(inputValueEdit);
    await supabase.from('places').update({ title: inputValueEdit, location: `POINT(${inputValueLocation.replace(',','')})` }).eq("id", modalItem.key);
    window.location.reload();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSearch = (value: string) => {
    console.log(searchText);
    setSearchText(value);
    const filtered = arrayToSearch.filter((item:string) => item[searchKey].toLowerCase().includes(value.toLowerCase()));
    setFilteredArray(filtered);
  };
  async function removeTopic(item:any) {
    console.log(item);
    const response = await supabase.from('places').delete().eq('id', item.key);
    console.log(response);
    window.location.reload();
  }
  async function addTopic() {
    await supabase.from('places').insert({ title: inputValueAdd, location: `POINT(${inputValueLocationAdd.replace(',','')})`});
    window.location.reload();
  }

  return (
    <div>
      <Input.Search className='inputSearch' placeholder="Введите поисковый запрос" onSearch={onSearch} />
      <div className="topicAddContainer">
        <Input value={inputValueAdd} onChange={handleChangeAdd} placeholder="Добавить наззвание места" />
        <Input value={inputValueLocationAdd} style={{borderRadius: 0}} onChange={handleChangeLocationAdd} placeholder="Добавить координаты места" />
        <Button onClick={addTopic}> <PlusOutlined /></Button>
      </div>
      <div className="topicListWrapper">
          {filteredArray.map((item:any, index:number) => (
            <div className='topicItem' key={index}>
              <p>Название: <span>{item.title}</span></p>
              <span>Дата создания: <span>{item.created_at}</span></span>
              <span>Дата обновления: <span>{item.updated_at}</span></span>
              <div>
                <button className='topicItemBtn' onClick={()=>{showModal(item)}}><EditOutlined /></button>
                <button className='topicItemBtn' onClick={()=>{removeTopic(item)}}><DeleteOutlined /></button>
              </div>
            </div>
          ))}
        </div>
      <Modal className='modalContainer' title="Изменить место" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button className='modalBtn' key="back" onClick={handleCancel}>Отмена</Button>,
        <Button className='modalBtn' key="submit" type="primary" onClick={handleOk}>Изменить</Button>
        ]}>
        <Input value={inputValueEdit} onChange={handleChangeEdit} placeholder="Впишите новый адресс" />
        <Input value={inputValueLocation} onChange={handleChangeLocation} placeholder="Впишите новые координаты" />
      </Modal>
    </div>
  );
};




const MapManager: React.FC = () => { 
    const [data, setData] = useState(new Array<Object>());
    const [load, setLoad] = useState(true);
    useEffect(() => {
      const fetchData = async () => {
        const { data } = await supabase.rpc('get_places_with_location')
        if (data) { 
            let tempData = data.map((item:{id:number,title:string,location:string,created_at:string,updated_at:string})=>{
                let tempLocation = item.location.replace("POINT(", "").replace(")", "").split(' ');
                let tempObj={
                  key: item.id,
                  title: item.title,
                  location: [Number(tempLocation[0]),Number(tempLocation[1])],
                  created_at: item.created_at.replace("T", " "),
                  updated_at: item.updated_at.replace("T", " ")
                }
                return tempObj
              })
        // console.log(tempData);
        setData(tempData.sort((a: { key: number; }, b: { key: number; }) => b.key - a.key));
        setLoad(false);
        }
      };
      fetchData();
    },[]);
    
   return(
    <div>
        {/* <YMaps query={{load: "package.full", apikey: '19bf606b-1241-4ce4-89a8-5e6fac08595d' }}> */}
        <div className="mapWrapper">
        <YMaps query={{load: "package.full", apikey: '19bf606b-1241-4ce4-89a8-5e6fac08595d' }}>
            <Map  
            width="90vw"
            height="50vh" 
            defaultState={{ center: [54.989345, 73.368211], zoom: 13 }} >
                { data.map((itemPlace:any,index:number)=>{ 
                // console.log(typeof data[0]);
                    return <Placemark key={index} defaultGeometry={itemPlace.location} />
                })}
            </Map>
        </YMaps>
        </div>

      {load ? <div className='loadingContainer'> <Spin indicator={<LoadingOutlined  spin />} /> </div>
     : 
      <div>
        <MySearch arrayToSearch={data} searchKey="title" />
      </div>
    }


    </div>
   )
}
  export default MapManager;
