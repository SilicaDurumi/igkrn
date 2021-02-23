import React, { useState } from "react";
import { dbService, storageService } from "fbInstance";

const Mind = ({mindObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newMind, setNewMind] = useState(mindObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are You Sure want to Delete?");
        if(ok){
            //delete mind
           await dbService.doc(`minds/${mindObj.id}`).delete();
           if(mindObj.attachmentUrl !== "" ){
               await storageService.refFromURL(mindObj.attachmentUrl).delete();
            }
        }
    };
    const toggleEditing = () => setEditing((prev)  => !prev);
    const onSubmit = async (event) =>{
        //when user push enter or Edit Mind
        event.preventDefault();
        await dbService.doc(`minds/${mindObj.id}`).update({
            text:newMind,
        });
        setEditing(false);
     };
    const onChange = (event) => {
        const {
            target:{ value },
        } = event;
        setNewMind(value);
    };

    return (
    <div>
        {editing ? (
            <>
                {isOwner && (
                <>
                <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit Your Mind" value={newMind} required 
                onChange={onChange}/>
                <input type="submit" value="Update Mind" />
                </form>
                <button onClick={toggleEditing}>Cancel</button> 
                </>
             )}
            </>
            ) : (
             <>
            <h4>{mindObj.text}</h4>
                {mindObj.attachmentUrl && (
                    <img src={mindObj.attachmentUrl} width="50px" height="50px" />
                )}
                {isOwner && ( 
                    <>
                        <button onClick={onDeleteClick}>Delete Mind</button>
                        <button onClick={toggleEditing}>Edit Mind</button>
                    </>
                )}
            </>
           )}
    </div>
    );
};

export default Mind;