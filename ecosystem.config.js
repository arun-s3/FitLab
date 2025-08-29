module.exports = {
  apps: [
    {
      name: "Fitlab-backend",
      script: "index.js",  
      instances: "max",    
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      },
      watch: false,             
      max_memory_restart: "500M" 
    }
  ]
};
