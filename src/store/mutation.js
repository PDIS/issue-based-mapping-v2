export default {
  addCount(state, num) {
    state.count += num //改變成state.js定義的count數值去加1，num是在actions我們丟進去的1
  }
}