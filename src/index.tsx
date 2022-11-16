import ReactDOM from 'react-dom';
import init from './init';

const render = async (): Promise<void> => {
  const vdom = await init();
  ReactDOM.render(vdom, document.getElementById('root'));
};

render();
