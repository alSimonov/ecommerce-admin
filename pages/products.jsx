import IconEdit from "@/components/Icons/IconEdit";
import IconTrash from "@/components/Icons/IconTrash";
import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios.get('/api/products').then(response => {
			setProducts(response.data);
		});
	}, [])
	return (
		<Layout>
			<Link className="btn-primary" href={'/products/new'}>
				Добавить новые товары
				{/* Add new products */}
			</Link>
			<table className="basic mt-2">
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
						</tr>
					))}
				</tbody>
			</table>
		</Layout> 
	)
}