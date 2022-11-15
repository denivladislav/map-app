import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './assets/index.css';
import init from './init';

const render = async (): Promise<void> => {
  const vdom = await init();
  ReactDOM.render(vdom, document.getElementById('root'));
}

render();
