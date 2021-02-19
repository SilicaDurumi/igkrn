import React, { useState } from "react";
import { dbService } from "../fbInstance";

const Home = () => {
    const [mind, setMind] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("minds").add({
            mind,
            createdAt: Date.now(),
        });
        setMind("");
    };
    const onChange = (event) => {
        const { target:{value}} = event;
        setMind(value);
    }

    return (
     <div>
         <form onSubmit={onSubmit}>
             <input value={mind} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
             <input type="submit" value="Mind Share" />
         </form>
     </div>
    );
};
 export default Home;