import antfu from "@antfu/eslint-config"
import drizzle from "eslint-plugin-drizzle";

export default antfu(
  {
  },
  {
        files: ["**/*.js", "**/*.ts"],
plugins: {
			drizzle,
		},

	},
);
