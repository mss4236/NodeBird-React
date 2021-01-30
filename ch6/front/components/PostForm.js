import React, { useRef, useCallback, useState, useEffect } from "react";
import { Input, Form, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ADD_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMGES_REQUEST } from "../reducers/post";

const PostForm = () => {
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    (state) => state.post
  );
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const imageInput = useRef();

  useEffect(() => {
    setText("");
  }, [postAdded === true]);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!text || !text.trim()) {  // text.trim 으로 스페이스만 친것도 막음
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append('image', i);
    });
    formData.append('content', text);
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData
    });
  }, [text, imagePaths]);

  const onChangeInputTextArea = useCallback((e) => {
    setText(e.target.value);
  }, []);

  // 이미지 업로드 Button Click Event
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click(); // 버튼을 클릭시 <input type="file" multiple hidden ref={imageInput}/> 를 누른 효과
  }, [imageInput.current]);

  // 이미지 업로드 input type="file"
  const onChangeImages = useCallback((e) => {  // 실제로 이미지를 업로드 했을 때
    const imageFormData = new FormData(); // 브라우저 제공 객체
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f); // 첫번째 인자 key를 이용해서 서버에서 인식하기 때문에 정확하게 써줘야한다.
    });
    dispatch({
      type: UPLOAD_IMGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  // 이미지 제거
  const onRemoveImage = useCallback((index) => () => {  // onRemoveImage(i)
    dispatch({
      type: REMOVE_IMAGE,
      index,
    });
  }, []);

  return (
    <>
      <Form
        encType="multipart/form-data"   // 이미지를 업로드 하려면 encType="multipart/form-data" 이여야함
        style={{ margin: "10px 0 20px" }}
        onSubmit={onSubmitForm}
      >
        <Input.TextArea
          maxLength={140}
          placeholder="어떤 신기한 일이 있었나요?"
          value={text}
          onChange={onChangeInputTextArea}
        />
        {/* 이미지 업로드 */}
        <div>
          <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
          <Button onClick={onClickImageUpload}>이미지 업로드</Button>
          <Button
            type="primary"
            style={{ float: "right" }}
            htmlType="submit"
            loading={isAddingPost}
          >
            등록
          </Button>
        </div>
        {/* 이미지 미리보기 */}
        <div>
          {imagePaths.map((v, i) => (
            <div key={v} style={{ display: "inline-block" }}>
              <img
                src={`http://localhost:3065/${v}`}
                style={{ width: "200px" }}
                alt={v}
              />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          ))}
        </div>
      </Form>
    </>
  );
};

export default PostForm;
