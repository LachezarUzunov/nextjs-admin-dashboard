import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";

export default function ProductForm({ _id, title: existingTitle, description: existingDescription, price: existingPrice, images: existingImages }) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);

    const saveProduct = async (ev) => {
        ev.preventDefault();
        const data = {title, description, price, images};

        if (_id) {
            // Update product
            await axios.put('/api/products', {...data, _id})
        } else {
            // Create product
            await axios.post('/api/products', data);
        }

        setGoToProducts(true);
    }

    if (goToProducts)
        router.push('/products');

    async function uploadImages(ev) {
        const files = ev.target?.files;

        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData;
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false);
        }
    }

    return (
   
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input 
                type="text" 
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                {!!images?.length && images.map(link => (
                    <div key={link} className="h-24">
                        <img src={link} alt="" className="rounded-lg"/>
                    </div>
                ))}
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center rounded-lg bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                    <div>Upload</div>
                <input type="file" className="hidden" onChange={uploadImages}/>
                </label>
            </div>
            <label>Description</label>
            <textarea 
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                >
            </textarea>
            <label>Price (in USD)</label>
            <input 
                type="number" 
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button type="submit" className="btn-primary">Save</button>
        </form>

    )
}