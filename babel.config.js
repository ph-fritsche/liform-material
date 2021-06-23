module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
                modules: process.env.BABEL_MODULES === 'false' ? false : process.env.BABEL_MODULES,
            },
        ],
        '@babel/preset-react',
    ],
}
