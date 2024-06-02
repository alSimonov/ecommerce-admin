import IconEdit from "@/components/Icons/IconEdit";
import IconTrash from "@/components/Icons/IconTrash";
import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';



export default function Products() {
	const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

	const [page, setPage] = useState(1);
  const [countProduct, setCountProduct] = useState(10);

  const [searchTitle, setSearchTitle] = useState("");


	const handleChangePage = (event, value) => {
    setPage(value);
  };


	useEffect(() => {
		fetchProducts();
		// fetchCategories();
	}, [])

	useEffect(() => {
    fetchProducts();
  },[page])

	useEffect(() => {
    fetchProducts();
  },[searchTitle])


	function fetchCategories() {
		axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
	}

	function fetchProducts() {
		axios.get('/api/products?title='+searchTitle+'&page='+page).then(response => {
			setProducts(response.data);
		});

		axios.get('/api/products?title='+searchTitle+'&count='+1).then(response => {
      setCountProduct(response.data );
		});
	}

	function loadDefaultFilters(category){
    const arrFilters = {};
    category.length > 0 && category.map((cat, index) => (
      arrFilters[cat.name] = false
    ))
      

    setFilters(arrFilters);
  }

	async function hideAndShowProduct(product , value){

		const data = {
			title: product.title,
			description: product.description, 
			price: product.price,
			measures: product.measures,
			images: product.images, 
			category: product.category, 
			properties: product.properties,
			available: product.available,
			active: value,
			_id: product._id,
			
		};

			//update
		await axios.put('/api/products', data);

		fetchProducts();
	}
	async function availableProduct(product , value){

		const data = {
			title: product.title,
			description: product.description, 
			price: product.price,
			measures: product.measures,
			images: product.images, 
			category: product.category, 
			properties: product.properties,
			available: value,
			active: product.active,
			_id: product._id,
			
		};


			//update
		await axios.put('/api/products', data);

		fetchProducts();
	}

	return (
		<Layout>
			<Link className="btn-primary" href={'/products/new'}>
				Добавить новые товары
				{/* Add new products */}
			</Link>
			<div className="flex">
				<div className="w-full">

				<input className="mt-4" type="text" placeholder="Поиск" value={searchTitle} name="searchTitle" onChange={ev => setSearchTitle(ev.target.value)}/>


				<table className="basic mt-2 ">
					<thead>
						<tr>
							{/* <td>Product name</td> */}
							<td>Наименование товара</td>
							<td></td>
							
						</tr>
					</thead>
					<tbody>
						{products.map(product => (
							<tr key={product._id}>
								<td>{product.title}</td>
								<td>
									<Link className="btn-default" href={'/products/edit/'+product._id}>
										<IconEdit/>
										Изменить
										{/* Edit */}
									</Link>
									<Link className="btn-red" href={'/products/delete/'+product._id}>
										<IconTrash/>
										Удалить
										{/* Delete */}
									</Link>
								</td>
								<td>
									{ product.available &&
										<button onClick={() => availableProduct(product, false)} className="btn-default mr-2">
											В наличии
										</button>
										||
										<button onClick={() => availableProduct(product, true)} className="btn-default mr-2">
											В наличии нет
										</button>
									}

									{ product.active &&
										<button onClick={() => hideAndShowProduct(product, false)} className="btn-default">
											Скрыть
										</button>
										||
										<button onClick={() => hideAndShowProduct(product, true)} className="btn-default">
											Показать
										</button>
									}


								</td>
							</tr>
						))}
					</tbody>
				</table>


				<div className="flex mt-5 justify-center ">
					<Pagination count={countProduct} page={page} onChange={handleChangePage} />
				</div>


			</div>
			{/* <div className=" bg-white ml-4 px-6 pt-5 h-fit w-30   rounded-lg shadow-lg ">
					{ categories && categories.map((cat, index) => (

						<div className=" flex items-center justify-left" key={index}>
							<input className="" type="checkbox"  onChange={ev => handleFiltersChange(name, key, ev.target.checked)}   /> <div> {cat.name} </div>	 
						</div>

					 ))
					}
			</div> */}

		</div>
		</Layout> 
	)
}