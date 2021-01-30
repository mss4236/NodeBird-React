// 회원가입 페이지
import React, { useState, useCallback, useEffect } from "react";
import { Form, Input, Checkbox, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userSignUpRequestAction } from "../reducers/user";
import Router from "next/router";

const SignUp = () => {
    const [id, setId] = useState("");
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);
    const dispatch = useDispatch();
    const { isSigningUp, signedUp, me } = useSelector((state) => state.user);

    useEffect(() => {
        if (me) {
            // 로그인 시 메인 페이지로 이동
            alert('로그인을 하였습니다. 메인페이지로 이동합니다.')
            Router.push("/");
        }
    }, [me && me.id]); // 자바스크립트에서는 undefined일 수 있으므로 가드를 항상 해줘야 한다
    // me는 객체이므로 비교하기 힘들어서 안쓰는게 좋다. 값인걸 쓰는게 좋음

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();

            if (password !== passwordCheck) {
                return setPasswordError(true);
            }
            if (!term) {
                return setTermError(true);
            }

            dispatch(
                userSignUpRequestAction({
                    userId: id,
                    nickname: nick,
                    password,
                })
            );
        },
        [id, nick, password, passwordCheck, term]
    );

    const onChangeId = useCallback(
        (e) => {
            setId(e.target.value);
        },
        [id]
    );
    const onChangeNick = useCallback(
        (e) => {
            setNick(e.target.value);
        },
        [nick]
    );
    const onChangePwd = useCallback(
        (e) => {
            setPassword(e.target.value);
        },
        [password]
    );
    const onChangePwdCheck = useCallback(
        (e) => {
            setPasswordCheck(e.target.value);
            return setPasswordError(false);
        },
        [passwordCheck]
    );
    const onChangeTerm = useCallback(
        (e) => {
            setTerm(e.target.checked);
            setTermError(false);
        },
        [term]
    );

    if (me) return null;

    return (
        <>
            {signedUp ? (
                <div>
                    <h1>회원가입 완료!!</h1>
                </div>
            ) : (
                    <Form onSubmit={onSubmit} style={{ padding: 10 }}>
                        <div>
                            <label htmlFor="user-id">아이디</label>
                            <br />
                            <Input name="user-id" value={id} required onChange={onChangeId} />
                        </div>
                        <div>
                            <label htmlFor="user-nick">닉네임</label>
                            <br />
                            <Input name="user-nick" value={nick} required onChange={onChangeNick} />
                        </div>
                        <div>
                            <label htmlFor="user-pwd">비밀번호</label>
                            <br />
                            <Input name="user-pwd" type="password" value={password} required onChange={onChangePwd} />
                        </div>
                        <div>
                            <label htmlFor="user-pwdCheck">비밀번호 확인</label>
                            <br />
                            <Input name="user-pwdCheck" type="password" value={passwordCheck} required onChange={onChangePwdCheck} />
                            {passwordError ? <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div> : ""}
                        </div>
                        <div>
                            <Checkbox name="user-term" onChange={onChangeTerm}>
                                위의 약관에 동의합니다.
                        </Checkbox>
                            {termError && <div style={{ color: "red" }}>약관에 동의하셔야 합니다.</div>}
                        </div>
                        <div>
                            <div style={{ marginTop: 10 }}></div>
                            <Button type="primary" htmlType="submit" loading={isSigningUp}>
                                가입하기
                        </Button>
                        </div>
                    </Form>
                )}
        </>
    );
};

export default SignUp;
