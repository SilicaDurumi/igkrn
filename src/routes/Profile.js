import React, { useState } from "react";
import PropTypes from "prop-types";
import { authService, storageService, dbService } from "../fbInstance";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { message } from "antd";
import "antd/dist/antd.css"

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [NewDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [photoURL, setPhotoURL] = useState(userObj.photoURL);
  const onLogOut = () => {
    authService.signOut();
    history.push("/");
  };

  const onUpdateProfile = async (event) => {
    event.preventDefault();
    if (NewDisplayName === "")
      return message.warning("이름 혹은 닉네임을 입력해 주세요.");

    if (userObj.displayName !== NewDisplayName) {
      await userObj.updateProfile({
        ...userObj,
        displayName: NewDisplayName,
      });
      refreshUser();
      onUpdateDisplayName("minds");

      setNewDisplayName("");
    }

    /// update profileImage
    let profileImageURL = "";
    if (photoURL !== userObj.photoURL) {
      message.warn("프로필을 업데이트 중입니다.");
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(photoURL, "data_url");
      profileImageURL = await response.ref.getDownloadURL();

      await userObj.updateProfile({
        ...userObj,
        photoURL: profileImageURL,
      });

      setPhotoURL(profileImageURL);
      refreshUser();

    }
    
    return message.success("프로필이 업데이트 되었습니다.");
    ///
  };

  const onUpdateDisplayName = (minds) => {
    dbService
      .collection(minds)
      .where("creatorId", "==", userObj.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach((doc) => {
          dbService.collection(minds).doc(doc.id).update({
            displayName: NewDisplayName,
          });
        });
      });
  };

  const onChange = (event) => {
    const { value } = event.target;
    setNewDisplayName(value);
  };

  const onFileChange = (event) => {
    console.log(userObj);
    const { files } = event.target;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setPhotoURL(result);
    };
    if (theFile) reader.readAsDataURL(theFile);
    
  };


  return (
    <div className="container">
      {photoURL ? (
        <img className="profile__img" alt="프로필 이미지" src={photoURL} />
      ) : (
        <div className="profile__img__container">
          <FontAwesomeIcon icon={faUserCircle} size="6x" />
        </div>
      )}
      <form onSubmit={onUpdateProfile} className="profileForm">
        <label htmlFor="image-file" className="profile__label">
          <span>프로필 이미지</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ opacity: 0 }}
        />
        <input
          type="text"
          placeholder="이름 혹은 닉네임을 입력해 주세요 :)"
          value={NewDisplayName}
          onChange={onChange}
          className="formInput"
          maxLength={8}
        />
        <input
          type="submit"
          value="프로필 업데이트"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOut}>
        로그아웃
      </span>
    </div>
  );
};

Profile.propTypes = {
  userObj: PropTypes.object.isRequired,
  refreshUser: PropTypes.func.isRequired,
};

export default Profile;