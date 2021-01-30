import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';    // 이미지 슬라이더 역할
import { Icon } from 'antd';
import styled from 'styled-components';

const Overlay = styled.div` 
    position: fixed;
    z-index: 5000;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;  // div style={{ position: 'fixed', zIndex: 5000, top: 0, left: 0, right: 0, bottom: 0 }}

const Header = styled.header`
    height: 44px;
    background: white;
    position: relative;
    padding: 0;
    text-align: center;

    & h1 {
        margin: 0;
        font-size: 17px;
        color: #333;
        line-height: 44px;
    }
`;  // header style={{ height: 44, background: 'white', position: 'relative', padding: 0, textAlign: 'center' }}  
// h1은 <Header><h1></h1></Header> Header안에 h1

const SlickWrapper = styled.div`
    height: calc(100% - 44px);
    background: #090909;
`;

const CloseBtn = styled(Icon)`
    position: absolute;
    right: 0;
    top: 0;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
`;  // <Icon type="close" onClick={onClose} style={{ position: 'absolute', right: 0, top: 0, padding: 15, lineHeight: '14px', cursor: 'pointer' }}/> // antd컴포넌트
// <CloseBtn type="close" onClick={onClose} />  // 위에꺼를 이렇게 바꿔줄수 있음

const ImageNum = styled.div`
    text-align: center;

    & div {
        width: 75px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background: #313131;
        display: inline-block;
        text-align: center;
        color: white;
        font-size: 15px;
    }
`;

const ImagesZoom = ({ images, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Overlay>
            <Header>
                <h1>상세 이미지</h1>
                <CloseBtn type="close" onClick={onClose} />
            </Header>
            <SlickWrapper>
                <div>
                    <Slick
                        initialSlide={0}    // 처음 시작 슬라이드
                        afterChange={(slide) => setCurrentSlide(slide)}
                        infinite={false}    // 마지막 슬라이드에서 계속 진행?
                        arrows
                        slidesToShow={1} // 한번에 한장만 보여주기
                        slidesToScroll={1} // 한번에 한장만 스크롤
                    >
                        {images.map(v => {
                            return (
                                <div style={{ padding: 32, textAlign: 'center' }}>
                                    <img src={`http://localhost:3065/${v.src}`} style={{ margin: '0 auto', maxHeight: 750 }} />
                                </div>
                            )
                        })}
                    </Slick>
                    <ImageNum>
                        <div>
                            {currentSlide + 1} / {images.length}    {/*몇번째 이미지를 보고있는지 */}
                        </div>
                    </ImageNum>
                </div>
            </SlickWrapper>
        </Overlay>
    );
};

ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({ // object를 좀 더 구체화해서 적어주는게 shape
        src: PropTypes.string,
    })).isRequired,
    onClose: PropTypes.func.isRequired
};

export default ImagesZoom;