const config = {
    proxy: {
        '/api': {
            target: 'http://localhost:8888',
            rewrite: p => p.replace(/^\/api/, 'http://localhost:8888'),
        }
    }
}

export default config;
