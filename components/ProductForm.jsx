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
	price:existingPrices,
	measures:existingMeasures,
	images: existingImages,
	category:assignedCategory,
	rate:assignedRate,
	properties:assignedProperties,
	available: assignedAvailable,
	active: assignedActive,

}) {
	const [title, setTitle] = useState(existingTitle || '');
	const [description, setDescription] = useState(existingDescription || '');
	const [category, setCategory] = useState(assignedCategory || '');
	const [productProperties, setProductProperties] = useState(assignedProperties || {});
	const [images, setImages] = useState(existingImages || []);
	const [price, setPrice] = useState(existingPrices || 0);
	const [measures, setMeasures] = useState(existingMeasures || []);
	const [goToProducts, setgoToProducts] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [rate, setRate] = useState(assignedRate || 0);
	const [available, setAvailable] = useState(assignedAvailable || true);
	const [active, setActive] = useState(assignedActive || true);
	const router = useRouter();

	
	const [errorTitleClass, setErrorTitleClass] = useState( title ? "hidden": "warning");
	const [errorCategoryClass, setErrorCategoryClass] = useState( category ? "hidden": "warning");


	useEffect(() => {
		axios.get('/api/categories').then(result => {
			setCategories(result.data);
		})
	},[]);

	
	async function setFeaturedProduct(){

		const data = {
			productId: _id,
			_id: "664f3dfe3b795a09c7aae38b"
		};

		// await axios.post('/api/featuredProduct', data);

		await axios.put('/api/featuredProduct', data);
	}


	function changeTitle(value){
		if (!value){
			setErrorTitleClass("warning");
		}
		else{
			setErrorTitleClass("hidden");
		}
		setTitle(value);
	}

	function changeCategory(value){
		if (!value){
			setErrorCategoryClass("warning");
		}
		else{
			setErrorCategoryClass("hidden");
		}
		setCategory(value);
	}


	async function saveProduct(ev) {
		if(errorTitleClass === "hidden" &&  errorCategoryClass === "hidden"){
			
			
			if (_id) {

			// ev.preventDefault();
			const data = {
				title, description, price,
				measures:measures.map(m => ({
					measure:m.measure,
					value:m.value
				})), 
				images, category, 
				properties:productProperties,
				active, available
			};

			console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
			console.log(data);

				//update
				await axios.put('/api/products', {...data, _id});
			} else {
				//create
				await axios.post('/api/products', data);
			}
			setgoToProducts(true);
		}
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
		if(catInfo){
			propertiesToFill.push(...catInfo.properties)
			while(catInfo?.parent?._id){
				const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
				propertiesToFill.push(...parentCat.properties);
				catInfo = parentCat;
			}
			
			propertiesToFill.forEach(element => {
				if(!Object.hasOwn(productProperties, element.name)){
					setProductProp(element.name, element.values[0]);
				}
			}); 
			
		}
		else if (errorCategoryClass !== "warning"){
			setErrorCategoryClass("warning");
			alert("Категория этого товара была не найдена, установите новую.");
		}
	}
	

	function addMeasure(){
    setMeasures(prev => {
      return [...prev, {measure:'', value:1}];
    });
  }
  function handleMeasureValueChange(index, newValue){
    setMeasures(prev => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  }
  function handleMeasureChange(index, newMeasure){
    setMeasures(prev => {
      const properties = [...prev];
      properties[index].measure = newMeasure;
      return properties;
    });
  }
  function removeMeasure(indexToRemove){
    setMeasures(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

	return (
	
		<div className="bg-white px-4 py-5 rounded-lg shadow-lg ">

			{ _id &&
				<button 
					onClick={() => setFeaturedProduct()}
					className="btn-primary"
					>
					Выставить на витрину
				</button>
			}

			<form onSubmit={saveProduct}>
				<label>Наименование товара</label>
				{/* <label>Product name</label> */}
				<input 
					text="text" 
					placeholder="Наименование товара" 
					value={title} onChange={ev => changeTitle(ev.target.value)}
				/>
				<div>
					<label className={errorTitleClass}>*Укажите наименование товара</label> 
				</div>

				<label>Категория</label>
				{/* <label>Category</label> */}
				<select 
					value={category} 
					onChange={ev => changeCategory(ev.target.value)}
				>
					<option value="">Не выбрано</option>
					{/* <option value="">Uncategorized</option> */}
					{categories.length > 0 && categories.map(c => (
						<option key={c._id} value={c._id}>{c.name}</option>
					))}
				</select>
				{propertiesToFill.length > 0 && propertiesToFill.map(p => (
					<div key={p._id} className="">
						<label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
						<div>
							<select 
								value={productProperties[p.name]} 
								onChange={ev => setProductProp(p.name, ev.target.value)}
							>
								{p.values.map(v => (
									<option key={v} value={v}>{v}</option>
								))}
							</select>
						</div>
					</div>
				))}

				<div>
					<label className={errorCategoryClass}>*Укажите категорию товара</label> 
				</div>

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

				<label className="block">Цена (за единицу)</label>

				<input 
							type="number"  
							value={price}
							className="mb-5" 
							onChange={ev => setPrice(ev.target.value)}
							placeholder="Цена"
							/>

				{<button 
					onClick={addMeasure}
					type="button" 
					className="btn-default text-sm mb-2 block" 
				>
					Добавить меру измерения
				</button>}
				
				{measures.length > 0 && measures.map( (measure, index) => (
					<div key={index} className="flex gap-1 mb-2">
						<input 
							type="text" 
							className="mb-0" 
							onChange={ev => handleMeasureChange(index, ev.target.value)}
							value={measure.measure} 
							placeholder="Мера измерения (например: шт., кг., куб.)"
							/>
						<input 
							type="number"  
							value={measure.value}
							className="mb-0" 
							onChange={ev => handleMeasureValueChange(index, ev.target.value)}
							placeholder="Количество эквивалентное количество штук"
							/>
						<button 
							onClick={() => removeMeasure(index)}
							type="button"
							className="btn-red">
							Удалить

						</button>
					</div>
				))} 


			
				{/* {errorTitleClass === "hidden" &&  errorCategoryClass === "hidden" && */}
					<button 
						type="submit" 
						className="btn-primary"
					>
						Сохранить
					</button>

					{/* || */}

					{/* <button 
						className="btn-disabled"
						>
						Сохранить
					</button> */}
				{/* } */}

				

			</form>
		</div>



	)
}