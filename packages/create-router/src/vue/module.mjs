export default function (paths) {
    return [
        {
            path: '/',
            element: <div>Home</div>,
            hasDone: true,
        },
        {
            path: '*',
            element: <div>404</div>,
            hasDone: true,
        }]
}