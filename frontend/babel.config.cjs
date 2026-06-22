module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    function() {
      return {
        visitor: {
          MetaProperty(path) {
            // Reemplaza import.meta por un objeto vacío para que no explote
            path.replaceWithSourceString('{ env: { MODE: "test" } }');
          }
        }
      };
    }
  ]
};