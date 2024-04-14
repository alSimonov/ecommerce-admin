import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Emails({swal}) {
  const [editedEmail, setEditedEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');

  
  useEffect(() => {
    fetchEmails();
  },[])
 


  function fetchEmails() {
    axios.get('/api/emails').then(result => {
      setEmails(result.data);
    });
  }
  async function saveEmail(ev){
    ev.preventDefault();
    const data = {
      email
    };
    
    if(editedEmail){
      data._id = editedEmail._id;
      await axios.put('/api/emails', data);
      setEditedEmail(null);
    } else {
      await axios.post('/api/emails', data);
    }

    setEmail('');
    fetchEmails();
  }


  function editEmail(emailObj) {
    setEditedEmail(emailObj);
    setEmail(emailObj.email);
  }

  function deleteEmail(emailObj){
    swal.fire({
      title: 'Вы уверены?',
      text: `Вы хотите удалить ${emailObj.email}?`,
      showCancelButton: true,
      cancelButtonText: 'Отмена',
      confirmButtonText: 'Да, удалить!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if(result.isConfirmed){
        const {_id} = emailObj;
        await axios.delete('/api/emails?_id='+_id);
        fetchEmails();
      }
    });
  }
  


	return (

    <Layout>
      <h1>Почты</h1>
      <label>{editedEmail ? `Изменить почту ${editedEmail.name}`: 'Добавить новую почту'}</label>
      <form onSubmit={saveEmail} >
        <div className="flex gap-1">
          <input 
            type="text" 
            placeholder={'полный адрес почты (например: example@yandex.ru)'} 
            onChange={ev => setEmail(ev.target.value)}
            value={email}
          />

        </div>

        <div className="flex gap-1">
          {editedEmail && (
            <button 
              type="button"
              className="btn-default"
              onClick={() => { 
                setEditedEmail(null);
                setEmail('');
              }}
            >
              Отменить
            </button>

          )}
          <button 
            type="submit" 
            className="btn-primary py-1"
          >
            Сохранить
          </button>
        </div>
      </form>
      {!editedEmail && (

        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Почта</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {emails.length > 0 && emails.map(prop => (
              <tr>
                <td>{prop.email}</td>
                <td>
                  <button 
                    onClick={() => editEmail(prop)} 
                    className="btn-default mr-1"
                  >
                    Изменить
                  </button>
                  <button 
                    onClick={() => deleteEmail(prop)}
                    className="btn-red"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>



	)
}


export default withSwal(({swal}, ref) => (
  <Emails swal={swal}/>
));