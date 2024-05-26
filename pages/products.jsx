import IconEdit from "@/components/Icons/IconEdit";
import IconTrash from "@/components/Icons/IconTrash";
import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetchProducts();
	}, [])

	function fetchProducts() {
		axios.get('/api/products').then(response => {
			setProducts(response.data);
		});
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
			<div className="">

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
		</div>
		</Layout> 
	)
}