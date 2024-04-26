import Layout from "@/components/Layout";
import PhotoUpload from "@/components/PhotoUpload";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

	const [description, setDescription] = useState('');



  useEffect(() => {
    fetchCategories();
  },[])
 




  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name, 
      parentCategory, 
      images,
      description,
      properties:properties.map(p => ({
        name:p.name, 
        values:p.values.split(',')
      })),
    };
    if(editedCategory){
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setImages([]);
    setDescription('');
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setImages(category.images);
    setDescription(category.description);
    setProperties(category.properties.map(({name,values}) => ({
      name, 
      values:values.join(',')
    })));
  }
  function deleteCategory(category){
    swal.fire({
      title: 'Вы уверены?',
      text: `Вы уверены что хотите удалить эту категорию ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Отмена',
      confirmButtonText: 'Да, удалить!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if(result.isConfirmed){
        const {_id} = category;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
    });
  }
  function addProperty(){
    setProperties(prev => {
      return [...prev, {name:'', values:''}];
    });
  }
  function handlePropertyNameChange(index, newName){
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, newValues){
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove){
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Категории</h1>
      <label>{editedCategory ? `Изменить категорию ${editedCategory.name}`: 'Создать новую категорию'}</label>
      <form onSubmit={saveCategory} >
        <div className="flex gap-1">
          <input 
            type="text" 
            placeholder={'Наименование категории'} 
            onChange={ev => setName(ev.target.value)}
            value={name}
          />
          <select 
            value={parentCategory}
            onChange={ev => setParentCategory(ev.target.value)}
          >
            <option value="">Нет родительской категории</option>
            {categories.length > 0 && categories.map(category => (
              <option value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>

        <label>Фотографии</label>
        <PhotoUpload  {...{images, setImages, isUploading, setIsUploading}}/>

        <label>Описание</label>

				<textarea 
					placeholder="Общее описание товаров категории"  
					value={description}
					onChange={ev => setDescription(ev.target.value)}
				/>

        <div className="mb-2">
          <label className="block ">Свойства</label>
         
          <button 
            onClick={addProperty}
            type="button" 
            className="btn-default text-sm mb-2" 
          >
            Добавить новое свойство
          </button>
          {properties.length > 0 && properties.map( (property, index) => (
            <div className="flex gap-1 mb-2">
              <input 
                type="text" 
                value={property.name}
                className="mb-0" 
                onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                placeholder="наименование свойства (например: цвет)"
                />
              <input 
                type="text" 
                className="mb-0" 
                onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                value={property.values} 
                placeholder="значения, разделенные запятой"
                />
              <button 
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red">
                Удалить
              </button>
            </div>
          ))} 
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button 
              type="button"
              className="btn-default"
              onClick={() => { 
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
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
      {!editedCategory && (

        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Наименование категории</td>
              <td>Родительская категория</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button 
                    onClick={() => editCategory(category)} 
                    className="btn-default mr-1"
                  >
                    Изменить
                  </button>
                  <button 
                    onClick={() => deleteCategory(category)}
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
  <Categories swal={swal}/>
));