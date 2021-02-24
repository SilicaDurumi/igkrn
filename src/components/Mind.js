import React, { useState } from "react";
import { dbService, storageService } from "fbInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="mind">
        {editing ? (
            <>
                {isOwner && (
                <>
                <form onSubmit={onSubmit} className="container mindEdit">
                <input type="text" placeholder="Edit Your Mind" value={newMind} required autoFocus
                onChange={onChange} className="formInput"/>
                <input type="submit" value="Update Mind" className="formBtn"/>
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>
                </>
             )}
            </>
            ) : (
             <>
            <h4>{mindObj.text}</h4>
            {mindObj.attachmentUrl && <img src={mindObj.attachmentUrl} />}

                {isOwner && ( 
                    <div class="mind__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )}
            </>
           )}
    </div>
    );
};

export default Mind;