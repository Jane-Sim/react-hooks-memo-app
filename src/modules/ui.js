import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/*  FOCUS_INPUT: InputSet 컴포넌트에 포커스
    BLUR_INPUT: 포커스 풀림
    CHANGE_INPUT: 제목, 혹은 내용이 수정됨
    RESET_INPUT: 내용을 초기화시킴 (완료를 눌렀을 때 실행됨)
*/
const FOCUS_INPUT = 'ui/write/FOCUS_INPUT';
const BLUR_INPUT = 'ui/write/BLUR_INPUT';
const CHANGE_INPUT = 'ui/write/CHANGE_INPUT';
const RESET_INPUT = 'ui/write/RESET_INPUT';

/*  OPEN_VIEWER: 연 메모장을 info 데이터로 받고, open값 변경
    CLOSE_VIEWER: 메모장을 닫음
    CHANGE_VIEWER_INPUT: 연 메모장의 제목 내용이 수정됨
*/

const OPEN_VIEWER = 'OPEN_VIEWER';
const CLOSE_VIEWER = 'CLOSE_VIEWER';
const CHANGE_VIEWER_INPUT = 'CHANGE_VIEWER_INPUT';

export const focusInput = createAction(FOCUS_INPUT);
export const blurInput = createAction(BLUR_INPUT);
export const changeInput = createAction(CHANGE_INPUT); // { name, value }
export const resetInput = createAction(RESET_INPUT);

export const openViewer = createAction(OPEN_VIEWER); // memo
export const closeViewer = createAction(CLOSE_VIEWER);
export const changeViewerInput = createAction(CHANGE_VIEWER_INPUT); // { name, value }

const initialState = Map({
  write: Map({
    focused: false,
    title: '',
    body: '',
  }),
  memo: Map({
    open: false,
    info: Map({
      id: null,
      title: null,
      body: null,
    }),
  }),
});

export default handleActions(
  {
    [FOCUS_INPUT]: state => state.setIn(['write', 'focused'], true),
    [BLUR_INPUT]: state => state.setIn(['write', 'focused'], false),
    [CHANGE_INPUT]: (state, action) => {
      const { name, value } = action.payload;
      return state.setIn(['write', name], value);
    },
    [RESET_INPUT]: state => state.set('write', initialState.get('write')),

    [OPEN_VIEWER]: (state, action) =>
      state
        .setIn(['memo', 'open'], true)
        .setIn(['memo', 'info'], action.payload),
    [CLOSE_VIEWER]: (state, action) => state.setIn(['memo', 'open'], false),
    [CHANGE_VIEWER_INPUT]: (state, action) => {
      const { name, value } = action.payload;
      return state.setIn(['memo', 'info', name], value);
    },
  },
  initialState
);
