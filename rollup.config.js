import typescript from 'rollup-plugin-typescript'

export default {
    input: 'src/ts/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs'
    },
    plugins: [
        typescript()
    ]
}