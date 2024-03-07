import { createBrowserRouter } from 'react-router-dom';
import Demo from './pages/demo/page';

export const createRouter = (paths) => {
  console.log(paths);

  const routes = [
    {
      path: '/',
      element: <div>
        Home
      </div>,
    },
    {
      path: 'demo',
      element: <Demo />,
      children: [
        {
          path: 'test1',
          element: <h1>test1</h1>,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return router;
};
