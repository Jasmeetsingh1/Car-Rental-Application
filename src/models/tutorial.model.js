const { mongoose } = require(".");

module.exports = (mongoose) => {
  const countriesSchema = mongoose.model(
    "countries",
    new mongoose.Schema(
      {
        name: String,
        cities: [String],
      },
      { timestamps: true }
    )
  );

  return countriesSchema;
};
