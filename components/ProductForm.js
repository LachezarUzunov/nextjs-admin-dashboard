import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({ _id, title: existingTitle, description: existingDescription, price: existingPrice }) {
    const router = useRouter();
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);

    const saveProduct = async (ev) => {
        ev.preventDefault();
        const data = {title, description, price};

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

    return (
   
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input 
                type="text" 
                placeholder="product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <lable>Description</lable>
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