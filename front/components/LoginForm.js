import React, { useState, useCallback } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginRequestAction, LOG_IN_REQUEST } from "../reducers/user";

// 커스텀 훅스
const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
};

const LoginForm = () => {
    const [userId, onChangeId] = useInput("");
    const [userPassword, onChangePassword] = useInput("");
    const dispatch = useDispatch();
    const { isLoggingIn } = useSelector((state) => state.user);

    const onsubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            dispatch(
                loginRequestAction({
                    id: userId,
                    password: userPassword,
                })
            );
        },
        [userId, userPassword]
    );

    return (
        <>
            <Form onSubmit={onsubmitForm} style={{ padding: "10px" }}>
                <div>
                    <label htmlFor="user-id">아이디</label>
                    <br />
                    <Input name="user-id" value={userId} onChange={onChangeId} />
                </div>
                <div>
                    <label htmlFor="user-password">비밀번호</label>
                    <br />
                    <Input name="user-password" type="password" value={userPassword} onChange={onChangePassword} />
                </div>
                <div>
                    <Button type="primary" htmlType="submit" loading={isLoggingIn}>
                        로그인
                    </Button>
                    <Link href="/signup">
                        <a>
                            <Button>회원가입</Button>
                        </a>
                    </Link>
                </div>
            </Form>
        </>
    );
};

export default LoginForm;
