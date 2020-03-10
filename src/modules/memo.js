import { createAction, handleActions } from 'redux-actions';
import { Map, List, fromJS } from 'immutable';
import { pender } from 'redux-pender';
import * as WebAPI from 'lib/web-api';

// 액션 타입
const CREATE_MEMO = 'memo/CREATE_MEMO';
// 초기 메모 리스트 부러오는 액션
const GET_INITIAL_MEMO = 'memo/GET_INITIAL_MEMO';
//
const GET_RECENT_MEMO = 'memo/GET_RECENT_MEMO';

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
  },
  initialState
);
