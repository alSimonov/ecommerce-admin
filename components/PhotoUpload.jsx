import { ReactSortable } from "react-sortablejs";
import Spinner from "./Spinner";
import axios from "axios";

export default function PhotoUpload ({images, setImages, isUploading, setIsUploading}){

	async function uploadImages(ev){
		try {
			const files = ev.target?.files;
			if(files.length > 0) {
				setIsUploading(true);
				const data = new FormData();
				
				if(!files[0].type.includes("image")){
					setIsUploading(false);
					alert("Ошибка при загрузке файла. Тип файла не опознан.");
				}
				else {

					data.append('file', files[0]);
				
					const res = await axios.post('/api/upload', data);
	
					setImages(oldImages => {
						return [...oldImages, ...res.data.links];
					});
					setIsUploading(false);

				}
			}
		} catch (error) {
			alert("Ошибка при загрузке файла.");
		}
		
	}
	function updateImagesOrder(images) {
		setImages(images);
	}

  return (
    <>
      <div className="mb-2 flex flex-wrap gap-1">
				<ReactSortable list={images} className="flex flex-wrap gap-1" setList={updateImagesOrder}>
					{!!images?.length && images.map(link => (
						<div key={link} className=" h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
							<img src={link} alt="" className="rounded-lg"/>
						</div>
					))}
				</ReactSortable>
				{isUploading && (
					<div className="h-24 flex items-center">
						<Spinner />
					</div>
				)}
				<label className="w-24 h-24 cursor-pointer test-center flex  flex-col items-center justify-center text-sm gap-1 text-primary 
				rounded-sm bg-white shadow-sm border border-primary"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
					</svg>
					<div>
						Загрузить
						{/* Upload */}
					</div>
					<input type="file" onChange={uploadImages} accept="image/*" className="hidden"/>
				</label>
			</div>
    </>
  );
}