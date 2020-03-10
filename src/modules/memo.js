import { createAction, handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import * as WebAPI from 'lib/web-api';

// 액션 타입
const CREATE_MEMO = 'memo/CREATE_MEMO';
// 초기 메모 리스트 불러오는 액션
const GET_INITIAL_MEMO = 'memo/GET_INITIAL_MEMO';
//
const GET_RECENT_MEMO = 'memo/GET_RECENT_MEMO';
// 메모 업데이터, 삭제 액션
const UPDATE_MEMO = 'memo/UPDATE_MEMO';
const DELETE_MEMO = 'memo/DELETE_MEMO';

// 액션 생성자
export const createMemo = createAction(CREATE_MEMO, WebAPI.createMemo); // { title, body }
export const getInitialMemo = createAction(
  GET_INITIAL_MEMO,
  WebAPI.getInitialMemo
);
export const getRecentMemo = createAction(
  GET_RECENT_MEMO,
  WebAPI.getRecentMemo
); // cursor

// createAction 의 두번째 파라미터는 meta 데이터를 만들 때 사용됩니다.
/*  액션 생성자를 만들땐, createAction() 의 두번째 파라미터로 payload => payload 가 설정이 되는데요. 
    이 두번째 파라미터는 액션의 payload 의 값에 따라 메타데이터를 정의해줍니다. 
    지금의 경우엔 payload 값 자체를 메타데이터로 설정하도록 했지요. 이렇게 하고 나면, 
    액션의 payload 값을, onSuccess 부분에서 action.meta 를 통하여 조회 할 수 있습니다.
*/
export const updateMemo = createAction(
  UPDATE_MEMO,
  WebAPI.updateMemo,
  payload => payload
); // { id, memo: {title,body} }
export const deleteMemo = createAction(
  DELETE_MEMO,
  WebAPI.deleteMemo,
  payload => payload
); // id

const initialState = Map({
  data: List(),
});

export default handleActions(
  {
    // 초기 메모 로딩
    ...pender({
      type: GET_INITIAL_MEMO,
      onSuccess: (state, action) =>
        state.set('data', fromJS(action.payload.data)),
    }),
    // 신규 메모 로딩
    ...pender({
      type: GET_RECENT_MEMO,
      onSuccess: (state, action) => {
        // 데이터 리스트의 앞부분에 새 데이터를 붙여준다
        const data = state.get('data');
        return state.set('data', fromJS(action.payload.data).concat(data));
      },
    }),
    // 메모 업데이트
    ...pender({
      type: UPDATE_MEMO,
      onSuccess: (state, action) => {
        const {
          id,
          memo: { title, body },
        } = action.meta;
        const index = state
          .get('data')
          .findIndex(item => item.get('id') === id);
        console.log(index);
        console.log(title);
        return state.updateIn(['data', index], memo =>
          memo.merge({
            title,
            body,
          })
        );
      },
    }),
    // 메모 삭제
    ...pender({
      type: DELETE_MEMO,
      onSuccess: (state, action) => {
        const id = action.meta;
        const index = state
          .get('data')
          .findIndex(memo => memo.get('id') === id);
        return state.deleteIn(['data', index]);
      },
    }),
  },
  initialState
);
