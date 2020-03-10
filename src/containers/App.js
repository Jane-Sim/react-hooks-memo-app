import React, { Component } from 'react';
import Header from 'components/Header';
import Layout from 'components/Layout';
import WriteMemo from './WriteMemo';

import * as memoActions from 'modules/memo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MemoListContainer from './MemoListContainer';
import MemoViewerContainer from './MemoViewerContainer';

class App extends Component {
  endCursor = 0;

  async componentDidMount() {
    // 스크롤을 감지하는 이벤트 리스너 추가.
    window.addEventListener('scroll', this.handleScroll);

    const { MemoActions } = this.props;
    // 초기 메모 로딩
    try {
      await MemoActions.getInitialMemo();
      this.getRecentMemos();
    } catch (e) {
      console.log(e);
    }
  }

  handleScroll = e => {
    const { clientHeight } = document.body;
    const { innerHeight } = window;

    // 현재 스크롤 위치와 클라이언트 높이, inner높이를 콘솔로 찍는다.
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;

    // clicentHeight는 해당 페이지의 최종 높이이며, innerHeight는 보여지지 않는 높이이며, scrollTop은 스크롤의 높이를 나타내는 위치이다.
    // clicentHeight - innerHeight - scrollTop 이 0에 가까울수록 페이지의 끝과 가깝다는 뜻이다.
    // clicentHeight = innerHeight + scrollTop
    //console.log(clientHeight, innerHeight, scrollTop);

    if (clientHeight - innerHeight - scrollTop < 100) {
      const { endCursor, MemoActions } = this.props;

      // endCursor 가 없거나, 이전에 했던 요청과 동일하다면 여기서 멈춘다.
      if (!endCursor || this.endCursor === endCursor) return;
      this.endCursor = endCursor;
      console.log('endCursor가 중복될까?');

      MemoActions.getPreviousMemo(endCursor);
    }
  };

  getRecentMemos = () => {
    const { MemoActions, cursor } = this.props;
    MemoActions.getRecentMemo(cursor ? cursor : 0);

    // short-polling - 5초마다 새 데이터 불러오기 시도
    setTimeout(() => {
      this.getRecentMemos();
    }, 1000 * 5);
  };

  render() {
    return (
      <Layout>
        <Header />
        <Layout.Main>
          <WriteMemo />
          <MemoListContainer />
        </Layout.Main>
        <MemoViewerContainer />
      </Layout>
    );
  }
}

export default connect(
  state => ({
    //cursor: 현재 보고있는 메모리스트의 첫 번째 id 값
    cursor: state.memo.getIn(['data', 0, 'id']),
    //endCursor: 현재 메모리스트의 맨 끝에 있는 id의 값
    endCursor: state.memo.getIn([
      'data',
      state.memo.get('data').size - 1,
      'id',
    ]),
  }),
  dispatch => ({
    MemoActions: bindActionCreators(memoActions, dispatch),
  })
)(App);
