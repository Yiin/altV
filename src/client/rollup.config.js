import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import alias from '../../build/plugins/alias';

export default {
	input: path.resolve(__dirname, 'index.ts'),
	output: {
		file: path.resolve(__dirname, '../../resources/gamemode/client.bundle.mjs'),
		format: 'esm',
	},

	external: ['alt', 'natives'],

	plugins: [
        alias({
			'alt/client': 'alt',
			'~': `./src/client`,
			'Shared': './src/shared',

			resolve: ['.js', '/index.js', '.ts', '/index.ts'],
        }),
		typescript({
			tsconfig: path.resolve(__dirname, 'tsconfig.json'),
		}),
		resolve(),
		builtins(),
		json(),
		// terser(),
	],
};
