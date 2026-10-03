export default {
  module: {
    rules: [
      {
        test: /\.css$/i,
        type: "css/auto",
        parser: {
          exportType: "text",
        },
      },
    ],
  },
};
