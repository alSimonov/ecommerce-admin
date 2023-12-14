import axios, { Axios } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { headers } from "@/next.config";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { Category } from "@/models/Category";
import PhotoUpload from "./PhotoUpload";
import InputLines from "./InputLines";

export default function ProductForm({
	_id,
	title:existingTitle, 	
	description:existingDescription, 
	prices:existingPrices,
	images: existingImages,
	category:assignedCategory,
	rate:assignedRate,
	properties:assignedProperties

}) {
	const [title, setTitle] = useState(existingTitle || '');
	const [description, setDescription] = useState(existingDescription || '');
	const [category, setCategory] = useState(assignedCategory || '');
	const [productProperties, setProductProperties] = useState(assignedProperties || {});
	const [images, setImages] = useState(existingImages || []);
	const [goToProducts, setgoToProducts] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [rate, setRate] = useState(assignedRate || 0);
	const router = useRouter();
	useEffect(() => {
		axios.get('/api/categories').then(result => {
			setCategories(result.data);
		})
	},[]);

	async function saveProduct(ev) {
		ev.preventDefault();
		const data = {
			title, description, 
			prices:prices.map(p => ({
				value:p.value, 
				measure:p.measure
			})), 
			images, category, 
			properties:productProperties
		};
		if (_id) {
			//update
			await axios.put('/api/products', {...data, _id});
		} else {
			//create
			await axios.post('/api/products', data);
		}
		setgoToProducts(true);
	}

	if (goToProducts){
		router.push('/products');
	}

	function setProductProp(propName, value){
		setProductProperties(prev => {
			const newProductProps = {...prev};
			newProductProps[propName] = value;
			return newProductProps
		})
	}
	
	const propertiesToFill = [];
	if(categories.length > 0 && category){
		let catInfo = categories.find(({_id}) => _id === category);
		propertiesToFill.push(...catInfo.properties)
		while(catInfo?.parent?._id){
			const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
			propertiesToFill.push(...parentCat.properties);
			catInfo = parentCat;
		}
	}
	

	function addPrice(){
    setPrices(prev => {
      return [...prev, {value:'', measure:''}];
    });
  }
  function handlePriceValueChange(index, newValue){
    setPrices(prev => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  }
  function handlePriceMeasureChange(index, newMeasure){
    setPrices(prev => {
      const properties = [...prev];
      properties[index].measure = newMeasure;
      return properties;
    });
  }
  function removePrice(indexToRemove){
    setPrices(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

	return (
	
		<form onSubmit={saveProduct}>
			<label>Наименование товара</label>
			{/* <label>Product name</label> */}
			<input 
				text="text" 
				placeholder="product name" 
				value={title} onChange={ev => setTitle(ev.target.value)}
			/>
			<label>Категория</label>
			{/* <label>Category</label> */}
			<select 
				value={category} 
				onChange={ev => setCategory(ev.target.value)}
			>
				<option value="">Не выбрано</option>
				{/* <option value="">Uncategorized</option> */}
				{categories.length > 0 && categories.map(c => (
					<option value={c._id}>{c.name}</option>
				))}
			</select>
			{propertiesToFill.length > 0 && propertiesToFill.map(p => (
				<div className="">
					<label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
					<div>
						<select 
							value={productProperties[p.name]} 
							onChange={ev => setProductProp(p.name, ev.target.value)}
						>
							{p.values.map(v => (
								<option value={v}>{v}</option>
							))}
						</select>
					</div>
				</div>
			))}
			<label>
				Фотографии
				{/* Photos  */}
			</label>
			
			<PhotoUpload {...{images, setImages, isUploading, setIsUploading}}/>

			<label>Описание</label>
			{/* <label>Description</label> */}
			<textarea 
				placeholder="описание товара"  
				value={description}
				onChange={ev => setDescription(ev.target.value)}
			/>

			<label className="block">Цена</label>
			<button 
				onClick={addPrice}
				type="button" 
				className="btn-default text-sm mb-2 block" 
			>
				Добавить цены
			</button>
			{prices.length > 0 && prices.map( (price, index) => (
				<div className="flex gap-1 mb-2">
					<input 
						type="number"  
						value={price.value}
						className="mb-0" 
						onChange={ev => handlePriceValueChange(index, ev.target.value)}
						placeholder="Цена"
						/>
					<input 
						type="text" 
						className="mb-0" 
						onChange={ev => handlePriceMeasureChange(index, ev.target.value)}
						value={price.measure} 
						placeholder="Мера измерения (например: шт., куб.)"
						/>
					<button 
						onClick={() => removePrice(index)}
						type="button"
						className="btn-red">
						Удалить
						{/* Remove */}
					</button>
				</div>
			))} 

			<button 
				type="submit" 
				className="btn-primary"
			>
				Сохранить
				{/* Save */}
			</button>

		</form>

	)
}