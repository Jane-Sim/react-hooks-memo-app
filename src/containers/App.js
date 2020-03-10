import React, { Component } from 'react';
import Header from 'components/Header';
import Layout from 'components/Layout';
import WriteMemo from './WriteMemo';

import * as memoActions from 'modules/memo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MemoListContainer from './MemoListContainer';

class App extends Component {
  async componentDidMount() {
    const { MemoActions } = this.props;
    // 초기 메모 로딩
    try {
      await MemoActions.getInitialMemo();
      this.getRecentMemo();
    } catch (e) {
      console.log(e);
    }
  }

  getRecentMemo = () => {
    const { MemoActions, cursor } = this.props;
    MemoActions.getRecentMemo(cursor ? cursor : 0);

    // short-polling - 5초마다 새 데이터 불러오기 시도
    setTimeout(() => {
      this.getRecentMemo();
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
      </Layout>
    );
  }
}

export default connect(
  state => ({
    cursor: state.memo.getIn(['data', 0, 'id']),
  }),
  dispatch => ({
    MemoActions: bindActionCreators(memoActions, dispatch),
  })
)(App);
