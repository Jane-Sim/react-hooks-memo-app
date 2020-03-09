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

export const focusInput = createAction(FOCUS_INPUT);
export const blurInput = createAction(BLUR_INPUT);
export const changeInput = createAction(CHANGE_INPUT); // { name, value }
export const resetInput = createAction(RESET_INPUT);

const initialState = Map({
  write: Map({
    focused: false,
    title: '',
    body: '',
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
  },
  initialState
);
