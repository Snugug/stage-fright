export default function updateHistory(index) {
  history.pushState(null, null, `#/${index}`);
}
