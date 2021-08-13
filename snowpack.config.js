/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    assets: { url: '/assets' },
    'node_modules/reactjs-popup/dist': { url: '/reactjs-popup', static: true },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss',
  ],
  devOptions: {
    open: 'none',
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    /* ... */
  },
  routes: [{ match: 'routes', src: '.*', dest: 'index.html' }],
  alias: {
    /* ... */
  },
}
