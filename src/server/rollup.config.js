import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import alias from '../../build/plugins/alias';

export default {
	input: path.resolve(__dirname, 'index.ts'),
	output: {
		file: path.resolve(process.cwd(), 'resources/gamemode/server.bundle.js'),
		format: 'cjs',
	},
	inlineDynamicImports: true,

	external: ['alt'],

	plugins: [
        alias({
			'alt/server': 'alt',
			'~': `./src/server`,
			'Shared': './src/shared',

			resolve: ['.js', '/index.js', '.ts', '/index.ts'],
        }),
		typescript({
			tsconfig: path.resolve(__dirname, 'tsconfig.json'),
		}),
		autoExternal({
			builtins: false,
			dependencies: true,
			packagePath: path.resolve(__dirname, '../../package.json'),
			peerDependencies: false,
		}),
		builtins(),
		resolve(),
		json(),
		// terser(),
	],
};
