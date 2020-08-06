module.exports = {
  apps: [
    {
      name: "med-list-site",
      script: "./server.js",
      watch: true,
	  ignore_watch: ["logs"],
      env: {
        "NODE_ENV": "development",
      },
      env_production: {
        "NODE_ENV": "production",
      },
    }
  ]
};
