import { useEffect, useState } from "react";
import "../../css/quiz4.css";

export default function Quiz4() {

    const [coffees, setCoffees] = useState([]);

    useEffect(() => {
        fetch("/api/coffees")
            .then(res => res.json())
            .then(data => setCoffees(data));
    }, []);

    return (
        <div className="container">

            <h1>☕ Coffee Menu</h1>

            <div className="cards">

                {coffees.map(coffee => (

                    <div className="card" key={coffee.id}>

                        <h2>{coffee.name}</h2>

                        <p>ประเภท : {coffee.type}</p>

                        <p>ราคา : {coffee.price} บาท</p>

                        <p>ขนาด : {coffee.size}</p>

                        <p>⭐ {coffee.rating}</p>

                        <button>Order</button>

                    </div>

                ))}

            </div>

        </div>
    );
}