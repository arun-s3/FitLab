module.exports = {
    apps: [
        {
            name: "Fitlab-backend",
            script: "index.js",
            instances: 1, 
            exec_mode: "fork", 
            env: {
              NODE_ENV: "production",
              PORT: 3000
            },
            watch: false,
            max_memory_restart: "500M",
        },
    ],
}
