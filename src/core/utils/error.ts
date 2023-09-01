import type { WarningMessage } from "vue/compiler-sfc";

export const createError = (id: string, error: Error | WarningMessage) =>
	"msg" in error
		? {
				id,
				plugin: "vue",
				message: error.msg,
				name: "vue-compiler-error",
		  }
		: {
				id,
				plugin: "vue",
				message: error.message,
				name: error.name,
				stack: error.stack,
		  };
