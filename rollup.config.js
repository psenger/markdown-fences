
import pkg from './package.json'

module.exports = {
    input: './src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        }
    ],
    plugins: []
}
