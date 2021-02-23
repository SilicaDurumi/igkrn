import React, { useState } from "react";
import {v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbInstance";

const MindFactory = ({ userObj }) => {
    const [mind, setMind] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit =  async (event) => {
    event.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {
        const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
        const response = await attachmentRef.putString(attachment, "data_url");
        attachmentUrl = await response.ref.getDownloadURL();
    }
    const mindObj = {
        text:mind,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
    };
    await dbService.collection("minds").add(mindObj);
    setMind("");
    setAttachment("");
   };
    const onChange = (event) => {
        const { target:{value}} = event;
        setMind(value);
    };

    //only image file not accept All file type: "image/" only
   const onFileChange = (event) => {
    const {target: { files },} = event;
    const theFile = files[0];
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const {currentTarget: { result },} = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
   };
  const onClearAttachment = () => 
      //when user attach non image file execute this
      setAttachment(null);

    return (
        <form onSubmit={onSubmit}>
             <input value={mind} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={119} />
             <input type="file" accept="image/*" onChange={onFileChange} />
             <input type="submit" value="Mind Share" />
             {attachment && (
                  <div>
                    <img src={attachment} width="49px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                  </div>
                )}
        </form>
    );
};

export default MindFactory;