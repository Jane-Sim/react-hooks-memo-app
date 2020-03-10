/*  메모장을 클릭했을 때, 보여지는 메모장 상세페이지입니다.
    이번엔 우리가 메모를 작성할때 만들었던 InputSet 과 SaveButton 을 재사용 할 수 있기때문에 새로 작성할 코드가 그리 많지 않습니다.
    이 컴포넌트에서는, 열려있는 메모의 내용, 그리고 4가지 함수:
    - onChange (인풋값 수정)
    - onUpdate (메모 내용 업데이트)
    - onDelete (메모 제거)
    - onClose (뷰어 닫기)
    를 전달받습니다.

    이 컴포넌트에서, Dimmed 컴포넌트는 뷰어 뒤 화면을 불투명하게 해주는데, 이를 클릭 시 뷰어가 닫힙니다.
*/

import React from 'react';
import { InputSet, SaveButton } from 'components/Shared';
import styled from 'styled-components';
import oc from 'open-color';
import PropTypes from 'prop-types';
import { media } from 'lib/style-utils';
// 쓰레기통 아이콘
import { IoMdTrash } from 'react-icons/io';

// 화면을 불투명하게 해줍니다.
const Dimmed = styled.div`
  background: ${oc.gray[3]};
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  position: fixed;
  z-index: 10;
  opacity: 0.5;
`;

//상세 페이지 메모장 화면.
const Viewer = styled.div`
  background: white;
  position: fixed;
  height: auto;
  z-index: 15;

  padding: 1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);

  ${media.tablet`
        width: calc(100% - 2rem);
    `}
`;

// 삭제버튼인 쓰레기통 아이콘
const TrashButton = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: ${oc.gray[6]};
  cursor: pointer;

  &:hover {
    color: ${oc.gray[7]};
  }

  &:active {
    color: ${oc.gray[8]};
  }

  font-size: 1.5rem;
`;

const MemoViewer = ({
  visible,
  title,
  body,
  onChange,
  onUpdate,
  onDelete,
  onClose,
}) => {
  // visible 이 아닐경우엔 아무것도 보여주지 않는다
  if (!visible) return null;

  return (
    <div>
      <Dimmed onClick={onClose} />
      <Viewer>
        <InputSet title={title} body={body} onChange={onChange} />
        <SaveButton onClick={onUpdate} />
        <TrashButton onClick={onDelete}>
          <IoMdTrash />
        </TrashButton>
      </Viewer>
    </div>
  );
};

MemoViewer.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.string,
  onChange: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default MemoViewer;
