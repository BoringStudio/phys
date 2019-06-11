const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src/server.ts'),
  target: 'node',
  mode: 'production',
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'dist/'),
    libraryTarget: 'commonjs'
  },
  externals: {
    sqlite3: 'sqlite3',
    mariasql: 'mariasql',
    mssql: 'mssql',
    mysql: 'mysql',
    oracle: 'oracle',
    'strong-oracle': 'strong-oracle',
    oracledb: 'oracledb',
    pg: 'pg',
    'pg-query-stream': 'pg-query-stream'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modules: ['node_modules'],
    alias: {
      '@': path.join(__dirname, 'src'),
      'mssql/lib/base': path.join(__dirname, 'aliases/null.js'),
      'mssql/package.json': path.join(__dirname, 'aliases/null.js'),
      'mysql2/index.js': path.join(__dirname, 'aliases/null.js'),
      mysql2: path.join(__dirname, 'aliases/null.js'),
      tedious: path.join(__dirname, 'aliases/null.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};
