import React, { useEffect, useState } from "react";
import { dbService } from "../fbInstance";
import Mind from "components/Mind";

const Home = ({ userObj }) => {
    const [mind, setMind] = useState("");
    const [minds, setMinds] = useState([]);
    useEffect(() => {
        dbService.collection("minds").onSnapshot(snapshot => {
        const mindArray = snapshot.docs.map(doc => ({id:doc.id, ...doc.data(),}));
    setMinds(mindArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("minds").add({
            text:mind,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setMind("");
    };
    
    const onChange = (event) => {
        const { target:{value}} = event;
        setMind(value);
    };

    return (
     <div>
         <form onSubmit={onSubmit}>
             <input value={mind} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
             <input type="submit" value="Mind Share" />
         </form>
        <div>
            {minds.map((mind) => (
            <Mind key={mind.id} mindObj={mind} isOwner={mind.creatorId === userObj.uid}/>
            ))}
        </div>
     </div>
    );
};
 export default Home;