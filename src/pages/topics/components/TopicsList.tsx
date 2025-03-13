import { Button, Input, Modal, Spin} from 'antd';
import { supabase } from '../../../shared/supabaseClient';
import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './TopicList.css'


const MySearch = ({ arrayToSearch, searchKey }:any) => {
  const [searchText, setSearchText] = useState('');
  const [filteredArray, setFilteredArray] = useState(arrayToSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItem, setmodalItem] = useState({key:''});
  const [inputValueEdit, setinputValueEdit] = useState('');
  const [inputValueAdd, setinputValueAdd] = useState('');

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValueEdit(e.target.value);
  }
  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValueAdd(e.target.value);
  }
  const showModal = (item:any) => {
    setIsModalOpen(true);
    setmodalItem(item)
  };

  async function handleOk() {
    setIsModalOpen(false);
    console.log(modalItem);
    console.log(inputValueEdit);
    await supabase.from('topics').update({ title: inputValueEdit }).eq("id", modalItem.key);
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
    const response = await supabase.from('topics').delete().eq('id', item.key);
    console.log(response);
    window.location.reload();
  }

  async function addTopic() {
    await supabase.from('topics').insert({ title: inputValueAdd});
    window.location.reload();
  }

  return (
    <div>
      <Input.Search className='inputSearch' placeholder="Введите поисковый запрос" onSearch={onSearch} />
      <div className="topicAddContainer">
        <Input value={inputValueAdd} onChange={handleChangeAdd} placeholder="Добавить интерес" />
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
      <Modal title="Изменить интерес" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      footer={[
        <Button className='modalBtn' key="back" onClick={handleCancel}>Отмена</Button>,
        <Button className='modalBtn' key="submit" type="primary" onClick={handleOk}>Изменить</Button>
        ]}
      >
        <Input value={inputValueEdit} onChange={handleChangeEdit} placeholder="Впишите новое значение" />
      </Modal>
    </div>
  );
};


function TopicsList() {
  const [data, setData] = useState(new Array<Object>());
  const [load, setLoad] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('topics').select();
      if (data) {
        let tempData = data.map((item)=>{
          let tempObj={
            key: item.id,
            title: item.title,
            created_at: item.created_at.replace("T", " "),
            updated_at: item.updated_at.replace("T", " ")
          }
          return tempObj
        })
        setData(tempData.sort((a, b) => b.key - a.key));
        setLoad(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
    {load ? <div className='loadingContainer'> <Spin indicator={<LoadingOutlined  spin />} /> </div>
     : 
      <div>
        <MySearch arrayToSearch={data} searchKey="title" />
      </div>
    }
    </>
  );
}

export default TopicsList;
