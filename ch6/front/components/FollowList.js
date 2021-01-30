import { List, Card, Button, Icon } from 'antd';
import propTypes from 'prop-types';
import { memo } from 'react';

const FollowList = memo(({ header, hasMore, onClick, dataSource, renderItemOnClick }) => {
    return (
        <List
            style={{ marginBottom: '20px' }}
            grid={{ gutter: 4, xs: 2, md: 3 }}
            size="small"
            header={<div>{header}</div>}
            loadMore={hasMore && <Button style={{ width: '100%' }} onClick={onClick}>더 보기</Button>}
            bordered
            dataSource={dataSource}
            renderItem={item => (
                <List.Item style={{ marginTop: '20px' }}>
                    <Card actions={[<Icon key="stop" type="stop" onClick={renderItemOnClick(item.id)} />]}>
                        <Card.Meta description={item.nickname}></Card.Meta>
                    </Card>
                </List.Item>
            )}
        />
    );
});

FollowList.propTypes = {
    header: propTypes.string.isRequired,
    hasMore: propTypes.bool.isRequired,
    onClick: propTypes.func.isRequired,
    dataSource: propTypes.array.isRequired,
    renderItemOnClick: propTypes.func.isRequired,
};

export default FollowList;