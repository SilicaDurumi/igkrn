import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbInstance";
import Mind from "components/Mind";
import MindFactory from "components/MindFactory";

const Home = ({ userObj }) => {
    const [minds, setMinds] = useState([]);

    useEffect(() => {
        dbService.collection("minds").onSnapshot(snapshot => {
        const mindArray = snapshot.docs.map(doc => (
            {id:doc.id, 
                ...doc.data(),
            }));
    setMinds(mindArray);
        });
    }, []);

    return (
     <div>
         <MindFactory userObj={userObj}/>
        <div>
            {minds.map((mind) => (
            <Mind 
                key={mind.id} 
                mindObj={mind} 
                isOwner={mind.creatorId === userObj.uid}
                />
            ))}
        </div>
     </div>
    );
};
 export default Home;