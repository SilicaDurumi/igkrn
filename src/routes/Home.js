import React, { useEffect, useState } from "react";
import { dbService } from "../fbInstance";
import Mind from "../components/Mind";
import MindFactory from "../components/MindFactory";

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
     <div className="container">
         <MindFactory userObj={userObj}/>
        <div style={{ marginTop: 30 }}>
            {minds.map((mind) => (
            <Mind 
                key={mind.id} 
                mindObj={mind} 
                isOwner={mind.creatorId === userObj.uid}
                isCreator={userObj.uid === mind.creatorId}
                userObj={userObj}
                />
            ))}
        </div>
     </div>
    );
};
 export default Home;